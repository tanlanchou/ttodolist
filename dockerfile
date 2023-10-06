# 使用官方的 Node.js 16 镜像作为基础镜像
FROM node:16.18

# 设置工作目录
WORKDIR /app

# 复制当前目录的所有文件到容器的工作目录
COPY . .

# 使用 cnpm 安装依赖
RUN npm install --registry=https://registry.npmmirror.com

# 执行 npm run build
RUN npm run build

# 暴露容器的 3000 端口
EXPOSE 3000

# 启动应用
CMD ["node", "dist/main.js"]
