(ns solsort.forsider.forsider
  (:require-macros
   [cljs.core.async.macros :refer [go go-loop alt!]]
   [reagent.ratom :as ratom :refer  [reaction]])
  (:require
   [cljs.reader]
   [solsort.toolbox.setup]
   [solsort.toolbox.appdb :refer [db db! db-async!]]
   [solsort.toolbox.ui :refer [input select]]
   [solsort.util
    :refer
    [<ajax <seq<! js-seq load-style! put!close! <blob-url
     parse-json-or-nil log page-ready render dom->clj]]
   [reagent.core :as reagent :refer []]
   [clojure.string :as string :refer [replace split blank?]]
   [cljs.core.async :refer [>! <! chan put! take! timeout close! pipe]]))

(load-style!
 {:span.medium-cover-image
  {:display :inline-block
   :position :relative
   :height :100px
   :text-align :center
   :min-width :50px
   :max-width :150px
   :vertical-align :top
   :margin :10px
   :box-shadow "2px 2px 5px #888888;"}
  ".medium-cover-image > img"
  {
   :height "100%"}
  }
 "styling")

(declare <file-to-image)

(defn <add-images [images]
  (js/console.log "add-images" images)
  (go
    (loop [i 0
           acc []]
      (if (< i images.length)
        (recur (inc i)
               (conj acc (<! (<file-to-image (aget images i)))))
        (db! [:images] (concat (db [:images] []) acc))))))

(defn <file-to-image [file]
  (go
    (log 
     {:title (.-name file)
      :data-url (<! (<blob-url file))
      })))

(defn ui:removable-image [idx image]
  [:span.medium-cover-image
   [:img {:src (:data-url image)}]
   [:span {:style
           {:display :inline-block
            :position :absolute
            :bottom 0
            :left 0}}]
   [:button.red.tiny.icon.ui.button
    {:on-click #(db! [:images] (remove #{image} (db [:images] []) ))
     :style {:position :absolute
             :right 0
             :top 0}}
    [:i.delete.icon]]
  ; " TODO: Billede her, selectable, etc."
   ])
(defn ui:images []
  (into
   []
   (concat
    [:div]
    [[:input
      {:type "file" :accept "image/*"
       :id "file-input"
       :style {:display :none}
       :multiple true
       :on-change
       #(<add-images (.-files (.-target %1)))}]]
    (map-indexed ui:removable-image (db [:images] []))
    [[:span.medium-cover-image
      {:on-click
       #(.click
         (js/document.getElementById "file-input"))}
      [:i.large.plus.icon
       {:style {:margin-top :20px}}]
      [:br] "tilføj" [:br] "billede" [:br]]
     [:hr]])))
(defn ui:login []
  [:div
   [:h4 "Adgang til den Åbne Platform"]
   [:div.ui.fluid.labeled.input
    [:div.ui.label "Client ID"]
    [input {:db [:settings :client-id]}]]
   [:div.ui.fluid.labeled.input
    [:div.ui.label "Client Secret"]
    [input {:db [:settings :client-secret]}]]])
(defn ui:upload-to-openplatform []
  [:div
   [:button.primary.ui.button "Upload forsider"]
   [:p "[Upload status]"]
   [ui:login]])
(defn ui:main []
  [:div.ui.container
   [:h1 {:style {:background :red}} "Prototype under udvikling, - virker ikke endnu."]
   [:h1 "Generering af forsider"]
   [ui:images]
   [:p "[Select position on image + sample rendering of title on image]"]
   [:p "[Settings for rendering title/author/... on cover]"]
   [:p "[Search query + list of first search results, with rendered covers]"]
   [ui:upload-to-openplatform]])

(defn body-element [id type]
  (let [elem (js/document.getElementById id)]
    (log 'elem elem (not (not elem)))
    (or
     elem
     (do
       (log 'create-elem)
       (let [elem (js/document.createElement type)]
         (aset elem "id" id)
         (js/document.body.appendChild elem)
         elem)))))

(defn data-url [data options]
  (js/URL.createObjectURL
   (js/Blob. #js [data] (clj->js options))))

(defn <render-html [ctx html x y w h]
  (let [c (chan)
        svg-url
        (str "data:image/svg+xml;utf8,"
             "<svg xmlns=\"http://www.w3.org/2000/svg\""
             " width=\"" w
             "\" height=\"" h
             "\"><foreignObject"
             " width=\"" w
             "\" height=\"" h
             "\"><div id=\"thumbnail-html\""
             " xmlns=\"http://www.w3.org/1999/xhtml\">"
             html
             "</div></foreignObject></svg>")
        img (js/Image.)]
    (doto img
      (aset "crossOrigin" "anonymous")
      (aset "onload"
            (fn []
              (.drawImage
               ctx
               img x y)
              (close! c)))
      (aset "onerror"
            (fn [e]
              (log 'error e)
              (throw e)))
      (aset "src" svg-url))
    c))
(defn render-cover [html]
  (let [canvas (body-element "render-canvas" "canvas")
        ctx (.getContext canvas "2d")
        img (js/Image.)]
    (go
      (doto ctx
        (.clearRect 0 0 3000 3000)

        (.drawImage img 0 0))
      (<! (<render-html ctx "<h1> he<em>ll</em>o</h1>"  0 0 100 100))
      (js/console.log (.toDataURL canvas)))
    (.fillRect ctx 0 0 100 100)))
(render-cover "")
(render [ui:main])
