## 运行步骤

### 使用yarn

```

1.yarn set version stable        // Yarn 升级到 Yarn Berry（Yarn 2/3/4） 版本。
2.yarn install
3.yarn build
4.pip install -e .  //安装 Python 依赖（链接到当前目录）
5.jupyter lab  //启动 Jupyter Lab

改完任何东西都需要重新运行3和4

删除命令

Remove-Item -Recurse -Force node_modules, yarn.lock, packages\*\node_modules, packages\*\yarn.lock

```

```jupyterlab-amphi下

1.需要使用 jlpm install
2.jlpm build
3.pip install -e .
5.jupyter lab  //启动 Jupyter Lab

```
