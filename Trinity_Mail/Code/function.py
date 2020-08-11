import base64
from Crypto import Random
from Crypto.Cipher import AES
import pickle

# Aes256 암호화에 필요한 함수와 변수
BS = 16 
pad = lambda s: s + (BS - len(s.encode('utf-8')) % BS) * chr(BS - len(s.encode('utf-8')) % BS)
unpad = lambda s : s[:-ord(s[len(s)-1:])]

key = [0x10, 0x01, 0x15, 0x1B, 0xA1, 0x11, 0x57, 0x72, 0x6C, 0x21, 0x56, 0x57, 0x62, 0x16, 0x05, 0x3D,
        0xFF, 0xFE, 0x11, 0x1B, 0x21, 0x31, 0x57, 0x72, 0x6B, 0x21, 0xA6, 0xA7, 0x6E, 0xE6, 0xE5, 0x3F]

# Aes256 암호 클래스
class Aes256:
    
    # 암호화 
    def encrypt( self, raw ):
        raw = pad(raw)
        iv = Random.new().read( AES.block_size )
        cipher = AES.new(bytes(key), AES.MODE_CBC, iv )
        result = base64.b64encode( iv + cipher.encrypt( raw.encode('utf-8') ) )
        return result

    # 복호화
    def decrypt( self, enc ):
        enc = base64.b64decode(enc)
        iv = enc[:16]
        cipher = AES.new(bytes(key), AES.MODE_CBC, iv )
        result = unpad(cipher.decrypt( enc[16:] ))
        return result.decode('utf-8')

# 시저 암호 클래스
class Sizer:

    # 암호화
    def encrypt( self, raw ):
        str_2 = [' ' if i is ' ' else chr(ord(i)+5) for i in raw]
        return ''.join(str_2)

    # 복호화    
    def decrypt( self, enc_u ):
        str_2 = [' ' if i is ' ' else chr(ord(i)-5) for i in enc_u]
        return ''.join(str_2)

# 파일 저장 및 호출 클래스
class File:

    # 저장
    def save(self,f_name,data):
        with open(f_name, 'wb') as f:
            pickle.dump(data, f, pickle.HIGHEST_PROTOCOL)
    
    # 호출
    def load(self,f_name):
        with open(f_name, 'rb') as f:
            load_data = pickle.load(f)
            return load_data
