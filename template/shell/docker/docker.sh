# docker run -v ~/.ssh:/root/.ssh -v ~/project/react/react-project/docker/gitConfig.json:/root/app/gitConfig.json -v ~/project/react/react-project/node_modules:/root/node_modules -v ~/project/react/react-project/dist:/root/app/dist -e PROJECT=hotmall -e ENV=master -it --rm react-2
# 变量
# ENV = dev / master
# echo ${a%%\@*}
ENV=$1

cd /root/app


echo "分支 >>>>> "
echo $ENV

echo "git版本号 >>>>> "
git --version

git config --global user.email "panjinquan@clickwifi.net"
git config --global user.name "panjinquan"

echo "切换分支编译代码 >>>>> "
git checkout $ENV
git pull origin $ENV

echo "获取配置/版本号 >>>>> "
VERSION=$(cat ./package.json | grep "version" | sed 's/"version": //g' | sed 's/"//g' | sed 's/ //g' | sed 's/,//g' | sed 's/\r//g')
echo $VERSION



echo "进入case环境 >>>>> "
npm -v

case $ENV in
  dev)
  
    echo "------------------ dev --------------------"
    echo "------------------ build --------------------"
    npm run dev-build


    echo "------------------ 上传cdn --------------------"
    npm run cdn-push-dev

    echo "------------------ 部署html --------------------"
    scp -i ./shell/docker/ssh/jenkins -r ./dist/index.html front-end@10.10.10.213:/data/www/static.igeekee.cn/projs_dev/laike-app-download

    echo "docker.sh 运行完毕 >>>>> "

  ;;
  master)

    echo "------------------ master --------------------"
    echo "------------------ build --------------------"
    npm run prod-build


    echo "------------------ 上传cdn --------------------"
    npm run cdn-push-prod

    echo "------------------ 部署版本 --------------------"
    npm run cdn-html

    echo "docker.sh 运行完毕 >>>>> "
  ;;
  *)
    echo 'ENV错误'
  ;;
esac


