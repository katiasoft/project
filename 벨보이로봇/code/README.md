```c
// 헤더 부분
#include <Wire.h>
#include <Servo.h>  
#include <LIDARLite.h>
#include<SoftwareSerial.h>
#define L_dir 31      // 왼쪽 모터드라이버 방향전환
#define R_dir 32      // 오른쪽 모터드라이버 방향전환
#define L_pwm 5       // 왼쪽 모터드라이버 PWM
#define R_pwm 4       // 오른쪽 모터드라이버 PWM
#define lidar_sig 3   // 라이다에서 신호를 받아오는 핀
#define R_sensor 21   // 모터스피드센서의 출력을 받아오는 핀
#define mode_sw 52    // 스위치전환으로 모드전환을 받는 핀
#define lidar_sw 34   // 라이다 온오프스위치역할하는 핀

// 관리자 및 손님 프로그램
int z=0,a=0,b=1;
int R_count=0;
int countend[15][60]; // 행은 방을 열에서 첫번째는 motion을 두번째는 카운트를 배열에 저장
int motion;
int mode;
int count;
void R_Sensor() //카운팅 함수
{
    R_count++;
}
void Stop() //정지
{
 digitalWrite(L_dir,LOW);
 digitalWrite(R_dir,HIGH);
 analogWrite(L_pwm,0);
 analogWrite(R_pwm,0);
}

void forward() //전진
{
 digitalWrite(L_dir,LOW);
 digitalWrite(R_dir,HIGH);
 analogWrite(L_pwm,150);
 analogWrite(R_pwm,170);                
}

void Left() //좌회전
{
 digitalWrite(L_dir,HIGH);
 digitalWrite(R_dir,HIGH);
 digitalWrite(L_pwm,HIGH);
 digitalWrite(R_pwm,HIGH);
}

void right()  //우회전
{
 digitalWrite(L_dir,LOW);
 digitalWrite(R_dir,LOW);
 digitalWrite(L_pwm,HIGH);
 digitalWrite(R_pwm,HIGH);
}

void reverse() //후진
{
 digitalWrite(L_dir,HIGH);
 digitalWrite(R_dir,LOW);
 analogWrite(L_pwm,150);
 analogWrite(R_pwm,170);
}

void setup()  //모든 핀과 모드를 설정해주는 함수 
{
  pinMode(31, OUTPUT);
  pinMode(32, OUTPUT);
  pinMode(52, INPUT_PULLUP);
  pinMode(4, OUTPUT);
  pinMode(5, OUTPUT);
  pinMode(34,OUTPUT);
  digitalWrite(3, INPUT_PULLUP);
  digitalWrite(21, INPUT);
  attachInterrupt(1,Stop,RISING);  // 라이다 프로그램에서 보내주는 신호에 따라 인터럽트 발생
  attachInterrupt(2,R_Sensor,FALLING);  // 모터스피드센서의 출력에 따라 인터럽트 발생 
  Serial.begin(115200);
  Serial3.begin(115200);
}

void loop()   //  실질적으로 동작하는 함수
{
  mode = digitalRead(mode_sw);  //  스위치에 들어오는 디지털값을 읽어서 변수 mode에 저장
  if(mode == 1) // mode가 1일때 관리자모드
  {
    digitalWrite(lidar_sw,LOW); // 라이다프로그램 오프상태
    if(Serial3.available()) // 블루투스에서 값을 보냈을때 
    {
      motion = Serial3.read(); // motion에 블루투스에서 보낸 값을 넣어라
      Serial.println(motion); 
      switch(motion)
      {
        case 0 : Stop();                          //  정지버튼 누를시
                 countend[z][b]=R_count;          //  카운팅 배열에 저장
                 Serial.print("value 1 : ");
                 Serial.println(countend[z][b]);
                 R_count = 0;                     //  카운팅 초기화
                 a+=2;                            //  다음 motion구간으로 이동
                 b+=2;
                 break;
        case 1 : countend[z][a] = motion;    //  전진버튼 누를시 전진 motion을 countend[z][a]에 저장 
                 forward();                 
                 break;
        case 2 : countend[z][a] = motion;    //  좌회전버튼 누를시 좌회전 motion을 countend[z][a]에 저장 
                 Left();
                 break;
        case 3 : countend[z][a] = motion;    //  우회전버튼 누를시 우회전 motion을 countend[z][a]에 저장 
                 right();
                 break;
        case 4 : countend[z][a] = motion;    //  후진버튼 누를시 후진 motion을 countend[z][a]에 저장 
                 reverse();
                 break;
        case 5 : countend[z][a] = 9;     //  완료버튼 누를시에 행을 옮기고 카운팅 초기화및 배열 위치 초기화
                 z++;
                  R_count = 0;
                 a=0;
                 b=1;
                 break;
        default : break;
      }
    }
  }
  else if(mode == 0) // mode가 0일때 손님모드
  {  
    digitalWrite(lidar_sw,LOW); // 라이다프로그램 오프상태
    if(Serial3.available()) // 블루투스에서 값을 보냈을때
    {
      z = Serial3.read(); // z에 블루투스에서 보낸 값을 넣어라    
      digitalWrite(lidar_sw,HIGH); // 라이다프로그램 온상태
      motion   =   countend[z][a]; // motion에 배열countend[z][a]의 값을 넣어라
      count    =   countend[z][b]; // count에 배열countend[z][b]의 값을 넣어라
      switch(motion)
      {
        case 1 : forward();
                 break;
        case 2 : Left();
                 break;
        case 3 : right();
                 break;
        case 4 : reverse();
                 break;
        default : break;       
      }
        a+=2;
        b+=2; 
    }
    else
    {
      if(R_count == count) // 카운팅한 값과 저장된 카운트랑 같다면 
      {
        Stop(); // 정지
        R_count=0;  // 카운트 초기화
        if(countend[z][a]==9) // 배열 countend[z][a]가 9일때 
        {
          z=0;
          a=0;
          b=1;
          R_count = 0;
        }
        else
        {
          Serial3.print(z); // 블루투스로 z값을 어플로 전송
        }
      }
    }
  }
}

// 라이다 프로그램
#define lidar_sig 31 // 라이다프로그램 신호
Servo microServo0;
Servo microServo1;
LIDARLite lidarLite;
int cal_cnt = 0;
int dist;
int angle0 = 84;
int angle1;

void setup() // 설정함수
{
  Serial.begin(115200);
  pinMode(7,INPUT_PULLUP);
  pinMode(31,OUTPUT);
  microServo0.attach(servoPinA); 
  microServo1.attach(servoPinB); 
  lidarLite.begin(0, true); // 구성을 기본 값 및 I2C로 400kHz로 설정
  lidarLite.configure(0); // 이 숫자를 변경하여 대체 구성을 시도
}

void lidar() // lidar함수
{
  if ( cal_cnt == 0 ) {
        dist = lidarLite.distance()-20; // 거리산출후에 dist라는 변수에 저장
       } 
      else 
      {
        dist = lidarLite.distance(false)-20; // 거리산출후에 dist라는 변수에 저장
      }
       cal_cnt++;
       cal_cnt = cal_cnt % 100; // 초당 4번씩 찍어내라
       if(dist <= 50) // 거리가 50이하일떄 
       {
          digitalWrite(lidar_sig,HIGH); //라이다프로그램신호에 1을 써줘라
       }
       delay(10);
}

void loop() // 실질적으로 사용되는 함수
{
  if(digitalRead(lidar_sw) == 1) // 라이다프로그램 온오프에 온이 되었을 때
  {
    for (angle1 = 65; angle1 < 125; angle1++)
     {
       lidar();                      // lidar함수로 들어가서 수행
       microServo0.write(angle0);    // angle(각도)값으로 서보모터 제어
       microServo1.write(angle1);    // angle(각도)값으로 서보모터 제어
       delay(50);                    // delay로 각도의 변화 속도를 조절
     }
    for (angle1 = 125; angle1 > 65; angle1--)
    {
      lidar();                      // lidar함수로 들어가서 수행
      microServo0.write(angle0);    // angle(각도)값으로 서보모터 제어
      microServo1.write(angle1);    // angle(각도)값으로 서보모터 제어
      delay(50);                    // delay로 각도의 변화 속도를 조절 
     }
  }
}
```



