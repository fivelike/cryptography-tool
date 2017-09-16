import { Component } from '@angular/core';
import { NavController,NavParams,ToastController } from 'ionic-angular';
@Component({
  selector: 'page-hill',
  templateUrl: 'hill.html',
})
export class HillPage {
    result: string;
    invkey: Array<number>;
  constructor(public navCtrl: NavController,
      public navParams: NavParams,
      private toastCtrl: ToastController) {
  }


  //进行加密动作
  encrypt(text: HTMLInputElement,k: HTMLInputElement,n:HTMLInputElement):void{
      if(text.value ==="" || k.value ==="" || n.value === ""){
          this.presentToast("Text , k and n can't be null! Please input again.");
          return ;
      }

      let num = Number(n.value);
      let textstr = text.value.toUpperCase();

      if(textstr.length%num != 0){
          this.presentToast("The format of Text and n is incorrect ! Please check it.");
          return ;
      }
      let key = this.kRun(k.value,num);
      if(typeof key =="string"){
          this.presentToast(key);
          return ;
      }

    this.result = this.eString(textstr,key,num);
  }


  //进行解密动作
  decrypt(text: HTMLInputElement,k: HTMLInputElement,n:HTMLInputElement): void{
      if(text.value ==="" || k.value ==="" || n.value === ""){
          this.presentToast("Text , k and n can't be null! Please input again.");
          return ;
      }

      let num = Number(n.value);
      let textstr = text.value.toUpperCase();

      if(textstr.length%num != 0){
          this.presentToast("The format of Text and n is incorrect ! Please check it.");
          return ;
      }
      let key = this.kRun(k.value,num);
      if(typeof key =="string"){
          this.presentToast(key);
          return ;
      }
    //   console.log(key);
      this.invkey = this.invk(key,num);
    this.result = this.eString(textstr,this.invk(key,num),num);


  }



  //解析密钥矩阵 return number[num][num]
  kRun(str:string,num:number): any{
      let newStr = str.split(" ");
    //   console.log(newStr);
      if(newStr.length != num*num){
          return "密钥矩阵K格式错误！矩阵应为方阵，请检查。"
      }
      let Arr = new Array(newStr.length/num);

      for(let i = 0; i<Arr.length;i++){

          Arr[i] = new Array();
          for(var j = 0; j<num; j++){
              Arr[i][j] = Number(newStr[i*num + j]);

          }
      }
        // console.log(Arr);
      return Arr;

  }

  //求逆矩阵 args : number[num][num] ; return number[num][num]
  invk(data: number[][],num: number): any{
      let newdata = new Array(num);
      let A = this.getMartrixResult(data);

        for(let i=0; i<num; i++) {
            newdata[i] = new Array(num);
            for(let j=0; j<num; j++) {
                if((i+j)%2 == 0) {
                    newdata[i][j] = this.getMartrixResult(this.getConfactor(data, i+1, j+1)) / A;
                }else {
                    newdata[i][j] = -this.getMartrixResult(this.getConfactor(data, i+1, j+1)) / A;
                }

            }
        }
        newdata = this.trans(newdata);

        // console.log(newdata);
        return newdata;
    }

    private  trans(newdata: number[][]) {
        let num = newdata.length;
        let newdata2 = new Array(num);
        for(let i=0; i<num; i++){
            newdata2[i] = new Array(num);
            for(let j=0; j<num; j++) {
                newdata2[i][j] = newdata[j][i];
            }
        }
        // console.log(newdata2);
        return newdata2;
    }

  //求(h,v)坐标的余子式
  getConfactor(data: number[][],h:number,v:number){
      let newData = new Array(data.length-1);
      for(let i = 0;i<data.length-1;i++){
          newData[i] = new Array(data.length-1);
          if(i<h-1){
              for(let j=0;j<data.length-1;j++){
                  if(j<v-1){
                      newData[i][j] = data[i][j];
                  }else{
                      newData[i][j] = data[i][j+1];
                  }
              }
          }else{
              for(let j=0; j<data.length-1; j++) {
                    if(j < v-1) {
                        newData[i][j] = data[i+1][j];
                    }else {
                        newData[i][j] = data[i+1][j+1];
                    }
                }
          }
      }

    //   console.log(newData);
      return newData;
  }

  //计算行列式的值
  getMartrixResult(data: number[][]): number{
      let num = data.length;
      //二维矩阵
      if(num == 2){
          return data[0][0]*data[1][1]-data[0][1]*data[1][0];
      }
      //二维以上矩阵
      let result:number = 0;
      let nums = new Array(num);
        for (let i= 0; i < num; i++) {
          if (i % 2 == 0) {
            nums[i] = data[0][i] * this.getMartrixResult(this.getConfactor(data, 1, i + 1));
          } else {
            nums[i] = -data[0][i] * this.getMartrixResult(this.getConfactor(data, 1, i + 1));
          }
        }
        for (let i= 0; i < num; i++) {
          result += nums[i];
        }
        // console.log(result);
        return result;
  }


  //加密 or 解密算法 与key矩阵相乘 str: uppercase return estring
  eString(str: string, key: number[][],num:number): string{
      let newStr = "";
      let T1 = new Array(0);
      let T2 = new Array(0);
      //将str ABCD...映射为0123 储存在T1中
      for(let i = 0; i<str.length;i++){
          let temp = str.charCodeAt(i);
          if(temp < 65 || temp > 91){
              continue;
          }else{
              T1.push(temp-65);
          }
      }
    //   console.log(T1);
    // 进行加密，结果储存在T2中

    for(let i=0;i<T1.length;i+=num){
        for(let j=0;j<num;j++){
            let a:number = 0;
            for(let p=0;p<num;p++){
                a += T1[i+p]*key[j][p];

            }

            T2.push(a%26);
        }

    }
    //将T2 映射为ABCD... 储存在newStr中
    for(let i = 0; i<T2.length;i++){
        newStr += String.fromCharCode(T2[i]+65);
    }
    // console.log(newStr);
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
