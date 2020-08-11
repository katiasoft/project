import tkinter
import tkinter.messagebox as box
import function 

class Main3:
    def __init__(self):

        # Command 함수 
        def tog():
            var = box.askyesno('실행','실행하시겠습니까?')
            if var == 1:

                radio_mode=book.get()
                if radio_mode == 1:
                    str_name=text_name.get("1.0","end-1c")+'.pickle'
                    str_text1=function.File.load(0,str_name)
                    str_text2=function.Sizer.decrypt(0,str_text1)
                    text2.insert('current',str_text2)
            
                elif radio_mode == 2:
                    str_name=text_name.get("1.0","end-1c")+'.pickle'
                    str_text1=function.File.load(0,str_name)
                    str_text2=function.Aes256.decrypt(0,str_text1)
                    print(type(str_text2))
                    text2.insert('current',str_text2)

            else :
                pass


        def load():
            var = box.askyesno('메일받기','받으시겠습니까?')
            if var == 1:
                str_name=text_name.get("1.0","end-1c")+'.pickle'
                str_text1=function.File.load(0,str_name)
                text1.insert('current',str_text1)
            else :
                pass

        def tog3():
             book.set(1)
        def tog4():
             book.set(2)

        # 전체 창의 환경설정 
        window=tkinter.Tk()
        window.title("TrinityMail")
        window.geometry("640x400")
        window.resizable(False, False)

        # 프레임 환경설정 
        frame2=tkinter.Frame(window,  bd=2 , bg='lightskyblue')
        frame2.pack(side="left",padx=1, fill="both", expand=True )
        frame1=tkinter.Frame(window,  bd=2, bg='paleturquoise')
        frame1.pack(side="left", fill="both", expand=True)

        # 버튼 환경설정과 배치
        b1_1=tkinter.Button(frame1, text="메일받기",command=load,bg='white')  
        b1_1.place(x=180, y=380, anchor="s")
        b2_1=tkinter.Button(frame1, text="실행하기", command=tog ,bg='white')
        b2_1.place(x=265, y=380, anchor="s")

        # 텍스트 환경설정과 배치
        text1=tkinter.Text(frame2)
        text1.place(x=12,y=75,anchor="nw",width=291,height=230)
        text2=tkinter.Text(frame1)
        text2.place(x=12,y=45,anchor="nw",width=291,height=260)
        text_name=tkinter.Text(frame2)
        text_name.place(x=100,y=45,anchor="nw",width=205,height=21)

        # 라벨 환경설정과 배치
        label=tkinter.Label(frame1, text="암호해제된 메일", width=41,bg='white')
        label.place(anchor = "nw",x=12,y=10)
        label=tkinter.Label(frame2, text="받은 메일", width=41,bg='white')
        label.place(anchor = "nw",x=12,y=10)
        label=tkinter.Label(frame2, text="My id", width=10,bg='white')
        label.place(anchor = "nw",x=12,y=45)

        # 라디오 버튼 환경설정과 배치
        book = tkinter.IntVar()
        book.set(1)
        radio_1 = tkinter.Radiobutton( frame1, text = '시저함수' , \
                            variable = book, value = 1,command=tog3,bg='white') 
        radio_2 = tkinter.Radiobutton( frame1, text = 'Aes256' , \
                            variable = book, value = 2,command=tog4,bg='white')  
        radio_1.place(anchor = "nw",x=12,y=315)
        radio_2.place(anchor = "nw",x=100,y=315)
        radio_1.select()
 
        window.mainloop()







