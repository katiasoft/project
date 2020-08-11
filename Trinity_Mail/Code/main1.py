import tkinter
import main2
import main3

# 전체 창의 환경설정 
window = tkinter.Tk()
window.title("TrinityMail")
window.geometry("500x300")
window.resizable(False, False)

# Command 함수 
def bt1():
    main2.Main2()
def bt2():
    main3.Main3()

# 이미지 불러오기와 크기 조절
img2 = tkinter.PhotoImage(file = 'writing.png')
img3 = tkinter.PhotoImage(file = 'mail.png')
small_img = tkinter.PhotoImage.subsample(img2, x = 4, y = 4)
small_img2 = tkinter.PhotoImage.subsample(img3, x = 4, y = 4)

# 버튼 환경설정과 배치
btn1 = tkinter.Button(window, text="Main2",  image = small_img, overrelief="solid", width=200,height=150, repeatdelay=1000, background='white',
cursor="plus", font = ('Arial' , 20),command=bt1 )
btn1.place(x=140, y=200, anchor="s")
btn2 = tkinter.Button(window, text="Main3",  image = small_img2, overrelief="solid", width=200,height=150, repeatdelay=1000, background='white',
cursor="plus", font = ('Arial' , 20), command=bt2)
btn2.place(x=360, y=200, anchor="s")

# 라벨 환경설정과 배치
label=tkinter.Label(window, text='TrinityMail에 오신걸 환영합니다', font = ('Arial' , 10)) 
label.place(x=92,y=200, anchor="nw",width=315,height=100 )
label=tkinter.Label(window, text='메일 쓰기', relief="solid", background='white')
label.place(x=30,y=190, anchor="nw",width=150,height=25 )
label=tkinter.Label(window, text='메일 읽기', relief="solid", background='white') 
label.place(x=320,y=190, anchor="nw",width=150,height=25 )
label=tkinter.Label(window, text='version 1.0', font = ('Arial' , 10))
label.place(x=405,y=260, anchor="nw",width=100,height=50 )

tkinter.Button()
window.mainloop()