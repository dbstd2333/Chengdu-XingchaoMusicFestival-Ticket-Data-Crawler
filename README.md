# 成都星巢秘境音乐节微店门票数据爬虫推送工具
backend文件夹里是记录历史数据的后端，go写的，gofiber框架 /n
web文件夹里是[历史余票大盘]: https://xingchao.dabaostudio.xyz/  (历史余票大盘)的网页源码，vue+echart，没用ts
main.js就是爬虫的源码的，负责爬数据+推送消息+记录历史数据，使用了pushplus的推送服务
