set -euo pipefail

mkdir -p public
cp -- ./*.html robots.txt sitemap.xml public/
cp -R -- assets public/

for section in blog ebooks services; do
  mkdir -p "public/$section"
  cp -- "$section"/*.html "public/$section/"
done
