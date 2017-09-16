import { Component } from '@angular/core';
import { NavController,NavParams,ToastController } from 'ionic-angular';

@Component({
  selector: 'page-vigenere',
  templateUrl: 'vigenere.html',
})
export class VigenerePage {

    result: string;
    static alpha:string ="ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  constructor(public navCtrl: NavController,
      public navParams: NavParams,
      private toastCtrl: ToastController) {
  }

  //进行加密动作
  encrypt(text: HTMLInputElement,k: HTMLInputElement){

    if(text.value ==="" || k.value ==="")   this.presentToast("Text and k can't be null! Please input again.");


    this.result = this.eString(text.value.toUpperCase(),k.value.toUpperCase());
  }


  //进行解密动作
  decrypt(text: HTMLInputElement,k: HTMLInputElement){
    //   console.log(text.value,k.value);
        //   console.log(this.dString(text.value,Number(k.value)));
    if(text.value ==="" || k.value ==="")   this.presentToast("Text and k can't be null! Please input again.");

    this.result = this.dString(text.value.toUpperCase(),k.value.toUpperCase());
  }



  //处理密钥 str : uppercase
  dealK(str: string, k:string){
      let newk = ""; //剔除无用字符的字符串
      let key:string = "";
      for(let i = 0; i<k.length;i++){
          let temp = k.charCodeAt(i);
        if(temp < 65 || temp > 91){
            continue;
        }
        else{
            newk += String.fromCharCode(temp);
        }
      }
      if(newk.length != str.length){
          //密钥长度与str不同，生成密钥字符串
          if(newk.length<str.length){
              //如果密钥长度比str短，则以不断重复密钥的方式生成密钥字符串
                while(newk.length<str.length){
                    newk+=newk;
                }
            }

            key = newk.slice(0,str.length);
      }
    //   console.log("key"+key);
      return key;

  }

  //加密算法
  eString(text: string, k: string){
      let p = "";//剔除非法字符
      let sb = "";
      for(let i = 0; i<text.length;i++){
          var temp = text.charCodeAt(i);
        //   console.log(temp);
        if(temp < 65 || temp > 91){
            continue;
        }
        else{
            p += String.fromCharCode(temp);
        }
      }
      k = this.dealK(p,k);

      for(let i=0;i<k.length;i++){
            let row= VigenerePage.alpha.indexOf(k.charAt(i));//行号
            let col=VigenerePage.alpha.indexOf(p.charAt(i));//列号
            let index = (row+col)%26;
            // console.log(index);
            sb += VigenerePage.alpha.charAt(index);
        }
        return sb;

  }

    //解密算法
  dString(str: string, k: string){
      let newStr = ""; //剔除非法字符的密文
      let sb = ""; //解密后的明文
      for(let i = 0; i<str.length;i++){
          var temp = str.charCodeAt(i);
        //   console.log(temp);
        if(temp < 65 || temp > 91){
            continue;
        }
        else{
            newStr += String.fromCharCode(temp);
        }
      }

      k=this.dealK(newStr,k);
      for(let i=0;i<k.length;i++){
                  let row=VigenerePage.alpha.indexOf(k.charAt(i));//行号
                  let col=VigenerePage.alpha.indexOf(newStr.charAt(i));//列号
                  let index;
                  if(row>col){
                      index=col+26-row;
                  }else{
                      index=col-row;
                  }
                  sb+=VigenerePage.alpha.charAt(index);
              }
              return sb;
  }



  //弹出层提示
  presentToast(s:string) {
  let toast = this.toastCtrl.create({
    message: s,
    duration: 2000,
    position: 'bottom'
  });
  toast.present();
  }

}
