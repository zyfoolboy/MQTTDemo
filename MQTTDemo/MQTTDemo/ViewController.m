//
//  ViewController.m
//  MQTTDemo
//
//  Created by deyi on 2016/9/22.
//  Copyright © 2016年 deyi. All rights reserved.
//

#import "ViewController.h"
#import <MQTTClient/MQTTClient.h>
#import <MQTTClient/MQTTWebsocketTransport.h>

@interface ViewController ()<MQTTSessionDelegate>

@property (nonatomic, strong) MQTTSession *mySession;
@property (weak, nonatomic) IBOutlet UILabel *messageLabel;
@property (weak, nonatomic) IBOutlet UITextField *messageText;

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    //MQTTWebsocketTransport *transport = [[MQTTWebsocketTransport alloc] init];//初始化对象
    MQTTCFSocketTransport *transport = [[MQTTCFSocketTransport alloc] init];//初始化对象
    
    transport.host = @"192.168.1.117";//设置MQTT服务器的地址
    
    transport.port = 1883;//设置MQTT服务器的端口
    
    self.mySession = [[MQTTSession alloc] init];//初始化MQTTSession对象
    
    self.mySession.transport = transport;//给mySession对象设置基本信息
    
    self.mySession.delegate = self;//设置mySession的代理为APPDelegate，同时不要忘记遵守协议~
    
    self.mySession.userName = @"user2";
    
    self.mySession.password = @"passwd2";
    
    //self.mySession.clientId = @"C_1474525659397";
    
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        [self.mySession connectAndWaitTimeout:30];//设定超时时长，如果超时则认为是连接失败，如果设为0则是一直连接。
        dispatch_async(dispatch_get_main_queue(), ^{
            // 订阅主题, qosLevel是一个枚举值,指的是消息的发布质量
            // 注意:订阅主题不能放到子线程进行,否则block不会回调
            [self.mySession subscribeToTopic:@"/World" atLevel:MQTTQosLevelAtLeastOnce subscribeHandler:^(NSError *error, NSArray<NSNumber *> *gQoss) {
                if (error) {
                    NSLog(@"连接失败 = %@", error.localizedDescription);
                }else{
                    NSLog(@"链接成功 = %@", gQoss);
                }
            }];
        });
    });
    // Do any additional setup after loading the view, typically from a nib.
}

- (void)newMessage:(MQTTSession *)session data:(NSData *)data onTopic:(NSString *)topic qos:(MQTTQosLevel)qos retained:(BOOL)retained mid:(unsigned int)mid {
    
    NSLog(@"log");
    NSString *str = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
    self.messageLabel.text = str;
}


- (IBAction)sendMessage:(UIButton *)sender {
    
    NSData *data = [self.messageText.text dataUsingEncoding:NSUTF8StringEncoding];
    
    [self.mySession publishAndWaitData:data
     
                               onTopic:@"topic"
     
                                retain:NO
     
                                   qos:MQTTQosLevelAtLeastOnce];
    
}



- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}


@end

