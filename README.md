# 在 iOS 中使用 MQTT 协议
>有关 MQTT 协议的概念这里不做过多描述，网上有大把的文章。本文主要讨论 MQTT 协议在 iOS 中的应用。

想完整的使用 MQTT 协议需要搭建一个服务器和完成 iOS 客户端代码。
##服务器搭建
本次使用 [emqttd](https://github.com/emqtt/emqttd) 作为服务器，EMQ 文档[地址](http://emqtt.com/docs/v2/index.html)，服务器搭建可以在该文档中查看。配置完成之后，在浏览器输入http://127.0.0.1:18083 用户名密码默认为 admin/public 界面如图：
![](https://github.com/zyfoolboy/MQTTDemo/blob/master/MQTTDemo/img/server.png)
至此，服务器已经搭建完成，可以开始 iOS 代码了。
##iOS 代码
在 iOS 客户端可以使用 [MQTTClient](https://github.com/ckrey/MQTT-Client-Framework) 库，支持 CocoaPod 导入。导入框架之后，第一步先初始化：
```
MQTTCFSocketTransport *transport = [[MQTTCFSocketTransport alloc] init];
transport.host = @"192.168.1.117";//MQTT服务器的地址,自己电脑的IP地址
transport.port = 1883;//设置MQTT服务器的端口
self.mySession = [[MQTTSession alloc] init];//初始化MQTTSession对象
self.mySession.transport = transport;//给mySession对象设置基本信息
self.mySession.delegate = self;//设置mySession的代理
self.mySession.userName = @"user2";
self.mySession.password = @"passwd2";
[self.mySession connectAndWaitTimeout:30];//开始连接服务器，返回值为YES则说明连接成功
```
这里连接方式是使用用户名和密码连接，还可以使用 clientID，具体可以看之前说的文档。

第二步开始订阅主题
```
[self.mySession subscribeToTopic:@"/World" atLevel:MQTTQosLevelAtLeastOnce subscribeHandler:^(NSError *error, NSArray<NSNumber *> *gQoss) {
                if (error) {
                    NSLog(@"订阅失败 = %@", error.localizedDescription);
                }else{
                    NSLog(@"订阅成功 = %@", gQoss);
                }
            }];
```
订阅成功之后，打开浏览器控制台，
![](https://github.com/zyfoolboy/MQTTDemo/blob/master/MQTTDemo/img/topic.png)
如图可以发现 Topics 中多了一个 /World,之后就可以向该主题发送消息了。

第三步向主题接收发送消息

接收消息只需要遵循 MQTTSession 的代理方法。

```
//接收消息
- (void)newMessage:(MQTTSession *)session data:(NSData *)data onTopic:(NSString *)topic qos:(MQTTQosLevel)qos retained:(BOOL)retained mid:(unsigned int)mid {
    
    NSLog(@"log");
    NSString *str = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
    self.messageLabel.text = str;
}
```

发送消息只需要设置目标 Topic 发送内容等

```
NSData *data = [self.messageText.text dataUsingEncoding:NSUTF8StringEncoding];
    
[self.mySession publishAndWaitData:data
                onTopic:@"topic"
                retain:NO
                qos:MQTTQosLevelAtLeastOnce];
``` 
代码完成，可以测试一下，分别用真机和模拟器来测试收发消息。

   | 订阅 Topic | 发送 Topic
---|-----------|-----------
真机| Simulators | Device
模拟器| Device | Simulators

真机订阅 Simulators Topic 向 Device Topic 发送消息
效果如下：
<p align="center"><img width="300" src="https://github.com/zyfoolboy/MQTTDemo/blob/master/MQTTDemo/img/Devicesend.PNG"> <img width="300" src="https://github.com/zyfoolboy/MQTTDemo/blob/master/MQTTDemo/img/Simulatorreceive.png"></p>

模拟器订阅 Device Topic 向Simulators Topic 发送消息
效果如下：
<p align="center"><img width="300" src="https://github.com/zyfoolboy/MQTTDemo/blob/master/MQTTDemo/img/Simulatorsend.png"> <img width="300" src="https://github.com/zyfoolboy/MQTTDemo/blob/master/MQTTDemo/img/Devicereceive.PNG"></p>

一个基于 MQTT 协议的简单的即时通讯功能已经完成。 


