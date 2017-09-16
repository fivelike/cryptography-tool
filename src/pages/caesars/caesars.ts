import { Component } from '@angular/core';
import { NavController,NavParams,ToastController } from 'ionic-angular';

/**
 * Generated class for the Caesars page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-caesars',
  templateUrl: 'caesars.html',
})
export class CaesarsPage {

    result: string;

  constructor(public navCtrl: NavController,
      public navParams: NavParams,
      private toastCtrl: ToastController) {
  }


  //进行加密动作
  encrypt(text: HTMLInputElement,k: HTMLInputElement){
    //   console.log(text.value,k.value);
    // console.log(this.eString(text.value,Number(k.value)));
    if(text.value ==="" || k.value ==="")   this.presentToast("Text and k can't be null! Please input again.");
    if(Number(k.value)>26 || Number(k.value)<0 ){
        this.presentToast("k must in [0,26]! Please input again.");
    }

    this.result = this.eString(text.value.toUpperCase(),Number(k.value));
  }


  //进行解密动作
  decrypt(text: HTMLInputElement,k: HTMLInputElement){
    //   console.log(text.value,k.value);
        //   console.log(this.dString(text.value,Number(k.value)));
    if(text.value ==="" || k.value ==="")   this.presentToast("Text and k can't be null! Please input again.");
    if(Number(k.value)>26 || Number(k.value)<0 ){
        this.presentToast("k must in [0,26]! Please input again.");
    }
    this.result = this.dString(text.value.toUpperCase(),Number(k.value));
  }




  //加密算法
  eString(str: string, k: number){
      let newStr = "";
      for(let i = 0; i<str.length;i++){
          var temp = str.charCodeAt(i);
        //   console.log(temp);
        if(temp < 65 || temp > 91){
            continue;
        }
        if(temp < (91 - k)){
            newStr += String.fromCharCode(temp + k);
        }
        else{
            newStr += String.fromCharCode(temp + k -26);
        }
      }
      return newStr;
  }

    //解密算法
  dString(str: string, k: number){
      let newStr = "";
      for(let i = 0; i<str.length;i++){
          var temp = str.charCodeAt(i);
        //   console.log(temp);
        if(temp < 65 || temp > 91){
            continue;
        }
        if(temp> (64 + k)){
            newStr += String.fromCharCode(temp - k);
        }
        else{
            newStr += String.fromCharCode(temp + 26 - k);
        }
      }
      return newStr;
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
