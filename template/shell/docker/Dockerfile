FROM node:18.16.1

# 变量
ARG ENV

# 装载环境 / 设置地区
RUN  npm config set registry 'https://registry.npmmirror.com' \
  && npm install -g cross-env pnpm 

# 工作目录
WORKDIR /root/app
# 复制需要编译文件 到 容器
COPY ./ ./

RUN pnpm store prune
RUN rm -rf ./pnpm-lock.yaml
RUN rm -rf ./node_modules
RUN pnpm install
# COPY pnpm-lock.yaml ./pnpm-lock.yaml
# RUN cnpm install phantomjs-prebuilt@2.1.16 --ignore-scripts
# RUN cnpm install moment
# RUN cnpm install --registry=https://r.npm.taobao.org


COPY ./shell/docker/docker.sh ./docker.sh 
COPY ./shell/docker/ssh /root/.ssh

RUN chmod 400 /root/.ssh/id-rsa

# COPY [all but **/node_modules/**] ./z
# COPY . .

RUN chmod +x /root/app/docker.sh

ENTRYPOINT /root/app/docker.sh $ENV