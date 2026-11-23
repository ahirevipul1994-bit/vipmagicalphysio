set -euo pipefail

mkdir -p public
cp -- site/*.html site/robots.txt 404.html public/
cp -R -- site/assets public/
cp -- assets/content.js public/assets/

cp -R -- site/blog site/ebooks public/
mkdir -p public/services
cp -- services/*.html public/services/

node site/tools/build.js public
