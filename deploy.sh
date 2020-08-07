#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd dist

# 发布到自定义域名
echo 'https://cvnull.com' > CNAME

git init
git add -A
git commit -m '📝'

git push -f https://github.com/lhz960904/lhz960904.github.io.git master

cd -