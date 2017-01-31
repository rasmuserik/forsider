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
    [<ajax <seq<! js-seq load-style! put!close!
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
  }
 "styling")

(defn <add-images [images]
  (js/console.log "add-images" images)
  (loop [i 0
         acc []]
    (if (< i images.length)
      (recur (inc i)
             (conj acc {:title (.-name (aget images i))}))
      (db! [:images] (concat (db [:images] []) acc)))))
(defn ui:removable-image [idx image]
  [:span.medium-cover-image
   [:button.red.tiny.icon.ui.button
    {:style {:position :absolute
             :right 0
             :top 0
             }}
    [:i.delete.icon]]
   (str idx)
   (str image)
   " TODO: Billede her, selectable, etc."
   ]
  )
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
       #(<add-images (.-files (.-target %1)))
      }]]
    (map-indexed ui:removable-image (db [:images] []))
    [[:span.medium-cover-image
      {:on-click
       #(.click
         (js/document.getElementById "file-input"))}
      [:i.large.plus.icon
       {:style {:margin-top :20px}}
       ]
      [:br] "tilføj" [:br] "billede" [:br]
      ]
     [:hr]
     ]
    ))
  )
(defn ui:login []
  [:div
   [:h4 "Adgang til den Åbne Platform"]
    [:div.ui.fluid.labeled.input
      [:div.ui.label "Client ID"]
   [input {:db [:settings :client-id]}]]
   [:div.ui.fluid.labeled.input
    [:div.ui.label "Client Secret"]
    [input {:db [:settings :client-secret]}]]]
  )
(defn ui:upload-to-openplatform []
  [:div
   [:button.primary.ui.button "Upload forsider"]
   [:p "[Upload status]"]
   [ui:login]]
  )
(defn ui:main []
  [:div.ui.container
   [:h1 {:style {:background :red}} "Prototype under udvikling, - virker ikke endnu."]
   [:h1 "Generering af forsider"]
   [ui:images]
   [:p "[Select position on image + sample rendering of title on image]"]
   [:p "[Settings for rendering title/author/... on cover]"]
   [:p "[Search query + list of first search results, with rendered covers]"]
   [ui:upload-to-openplatform]])

(render [ui:main])
