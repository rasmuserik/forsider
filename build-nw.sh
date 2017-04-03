if [ ! -f nwjs-sdk-v0.21.4-win-ia32.zip ]; then
  wget https://dl.nwjs.io/v0.21.4/nwjs-sdk-v0.21.4-win-ia32.zip
fi
rm -rf nwjs-sdk-v0.21.4-win-ia32
unzip nwjs-sdk-v0.21.4-win-ia32.zip
cp -a build/* nwjs-sdk-v0.21.4-win-ia32
mv nwjs-sdk-v0.21.4-win-ia32 generiske-forsider
mv generiske-forsider/nw.exe generiske-forsider/generiske-forsider.exe
zip -r generiske-forsider-win32.zip generiske-forsider
rm -rf generiske-forsider
scp generiske-forsider-win32.zip root@borg.solsort.com:public_html/
