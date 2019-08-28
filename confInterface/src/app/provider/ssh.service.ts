import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { AlertController, LoadingController } from "@ionic/angular"





@Injectable({
  providedIn: 'root'
})
export class SshService {
  //regular expression for IP address
  regex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
 regexVlan= /^(([1-9][0-9]{0,2}|[1-3][0-9][0-9][0-9]|40([0-8][0-9]|9[0-6]))(,\s*[1-9][0-9]{0,2}|[1-3][0-9][0-9][0-9]|40([0-8][0-9]|9[0-6]))*)$/;
  //global stuff
  user: string = "";
  pass: string = "";
 
  //Switch Variables:

  //create VLANs
  num = 0;
  hostIp = "";
  hosts = [];
  //configure VLANs
  hostn: string = "";
  vlan = 0;
  vlan_ip = "";
  vlan_mask = "";
  //routing
  A: boolean;
  B: boolean;
  C: boolean;
  host="";
  ipAdd = "";
  addresses = [];
  interface="";
  int_ip="";
  int_mask="";
  //DHCP Server
  D: boolean;
  E: boolean;
  F: boolean;
  G: boolean;
  hostDHCP="";
  pool="";
  dhcp_network="";
  dhcp_mask="";
  dhcp_router="";
  dhcp_addresses=[];
  excluded="";
  //PORTS
  public ports = [
    { val: 'f1/0', isChecked: false },
    { val: 'f1/1', isChecked: false },
    { val: 'f1/2', isChecked: false },
    { val: 'f1/3', isChecked: false },
    { val: 'f1/4', isChecked: false },
    { val: 'f1/5', isChecked: false },
    { val: 'f1/6', isChecked: false },
    { val: 'f1/7', isChecked: false },
    { val: 'f1/8', isChecked: false },
    { val: 'f1/9', isChecked: false },
    { val: 'f1/10', isChecked: false },
    { val: 'f1/11', isChecked: false },
    { val: 'f1/12', isChecked: false },
    { val: 'f1/13', isChecked: false },
    { val: 'f1/14', isChecked: false },
    { val: 'f1/15', isChecked: false },
    { val: 'f2/0', isChecked: false },
    
  ];
  switchports=[];
  hostP="";
  allowed=[];
  allow="";
  access_vlan="";

 //Router Variables:
 
 //Interfaces
 H:boolean;
 I: boolean;
 J: boolean;
 hostRInt="";
 Rinterface="";
 r_ip="";
 r_mask="";

 //Routing
 hostR="";
  neighbors=[];
 neighbor="";

//Get Conf:
configuration="";
configuration2="";
confHost="";
clear: boolean;


constructor(private http: HttpClient, private alertCtl: AlertController, private loadingCtrl: LoadingController) { }

  AddVlans(array=[],add=""){
    if (!this.regexVlan.test(add)){
      this.presentAlert("Type in a valid VLAN name!");
    }
    else{
    array.push(add);
  }
  }

  AddStuff(array=[],add=""){
    if (!this.regex.test(add)){
      this.presentAlert("Make sure to type in a valid IP Address!")
    }
    else{

    array.push(add);
    } 


  }
  

  async presentAlert(message: string) {
    const alert = await this.alertCtl.create({
      header: "Alert",
      message: message,
      buttons: ["OK"]


    });

    await alert.present();
  }

//*****************************TO CREATE VLANs******************************************** */
  
  async createVlan() {

    if ((this.hosts.length < 1) || (this.num <= 0)) {
      this.presentAlert("All the inputs fields have  to be filled");
    }
  

    else {
      const loading = await this.loadingCtrl.create({
        message: "Please wait",
        translucent: true,

      });

      await loading.present();
      let body = {
        "hosts": this.hosts,
        "username": this.user,
        "pass": this.pass,
        "numOfVLANS": this.num,

      }
      this.http.post('http://127.0.0.1:5000/createVlan', body, { responseType: 'text' }).subscribe((response) => {
        console.log(this.hosts);
        console.log(this.user + " " + this.pass);


        this.presentAlert(response);
        loading.dismiss();
      }, error => {
        loading.dismiss();
      });
      this.hosts = [];
      this.num = 0;
    }
  }



  //*****************************TO CONFIGURE A VLAN******************************************** */

  async configureVlan() {

    if ((((this.vlan <= 0) || (this.vlan_ip == "") || (this.vlan_mask == "")) || (this.hostn == "") )) {
      this.presentAlert("All the inputs fields have  to be filled");
    }
    else if (((!this.regex.test(this.hostn)) && (!this.regex.test(this.vlan_ip))) && (!this.regex.test(this.vlan_mask)) ) {
      this.presentAlert("Make sure to type in a valid IP Address!")
    }


    else {
      const loading = await this.loadingCtrl.create({
        message: "Please wait",
        translucent: true,

      });

      await loading.present();
      let body = {
        "ip_address": this.hostn,
        "username": this.user,
        "password": this.pass,
        "vlan": this.vlan.toString(),
        "vlan_ip": this.vlan_ip,
        "vlan_mask": this.vlan_mask
      }

      this.http.post('http://127.0.0.1:5000/configureVlan', body, { responseType: 'text' }).subscribe((response) => {

        this.presentAlert(response);
        loading.dismiss();
      }, error => {
        loading.dismiss();
      });
      this.hostn = "";
      this.vlan = 0;
      this.vlan_ip = "";
      this.vlan_mask = "";

    }
  }


    //*****************************TO CONFIGURE ROUTING******************************************** */
    
  async configureRouting(){
      
     this.A=this.regex.test(this.host);
     this.B=this.regex.test(this.int_ip);
     this.C=this.regex.test(this.int_mask);

     console.log( !(this.A && this.B && this.C) );
    
    if (((this.addresses.length < 1) || (this.int_ip == "") || (this.host == "") || (this.int_mask == ""))) {
      this.presentAlert("All the inputs fields have  to be filled");
    }
    else if (!(this.A && this.B && this.C))  {
      this.presentAlert("Make sure to type in a valid IP Address!");
    }


    else {
      const loading = await this.loadingCtrl.create({
        message: "Please wait",
        translucent: true,

      });

      await loading.present();
      let body = {
        "host_ip": this.host,
        "username": this.user,
        "password": this.pass,
        "interface": this.interface,
        "ip_add": this.int_ip,
        "mask": this.int_mask,
        "networks": this.addresses
      }

      this.http.post('http://127.0.0.1:5000/routing', body, { responseType: 'text' }).subscribe((response) => {

        this.presentAlert(response);
        loading.dismiss();
      }, error => {
        loading.dismiss();
      });
      this.interface="";
      this.host = "";
      this.addresses = [];
      this.int_ip = "";
      this.int_mask = "";

    }


  }

  //*****************************TO CONFIGURE DHCP SERVER******************************************** */
  




   async configureDHCP(){
      this.D= this.regex.test(this.hostDHCP);
      this.E= this.regex.test(this.dhcp_network);
      this.F= this.regex.test(this.dhcp_mask);
      this.G= this.regex.test(this.dhcp_router);
      
      if ((this.dhcp_addresses.length < 1) || (this.hostDHCP == "") ||(this.dhcp_network == "") || (this.dhcp_mask == "") 
      || (this.dhcp_router == "") || (this.pool == "")) {
        this.presentAlert("All the inputs fields have  to be filled");
      }
      else if ( !( this.D && this.E && this.F && this.G)){
        this.presentAlert("Make sure to type in a valid IP Address!");
      }
    
     
  
       else {
    
        const loading = await this.loadingCtrl.create({
          message: "Please wait",
          translucent: true,
  
        });
  
        await loading.present();
        let body = {
          "host": this.hostDHCP,
          "username": this.user,
          "password": this.pass,
          "pool": this.pool,
          "network": this.dhcp_network,
          "mask": this.dhcp_mask,
          "router": this.dhcp_router,
          "addresses": this.dhcp_addresses
        }
        this.http.post('http://127.0.0.1:5000/dhcp', body, { responseType: 'text' }).subscribe((response) => {

          this.presentAlert(response);
          loading.dismiss();
        }, error => {
          loading.dismiss();
        });
        this.hostDHCP = "";
        this.dhcp_network ="";
        this.dhcp_mask="";
        this.dhcp_router="";
        this.dhcp_addresses=[];
        
      }

}


async configurePorts(mode=""){ 
  for (let entry of this.ports) {
    if (entry.isChecked){
      this.switchports.push(entry.val);
      console.log(this.switchports);  
    } }

//trunk mode
    if (mode == "trunk"){
      if ( (this.allowed.length<1) || (this.ports.length< 1) || (this.hostP=="") ){
        this.presentAlert("All the inputs fields have  to be filled");
      }
      else if ( (!this.regex.test(this.hostP)) ) {
        this.presentAlert("Make sure to type in a valid IP Address!");
      }
      else {

        const loading = await this.loadingCtrl.create({
          message: "Please wait",
          translucent: true,
  
        });
  
        await loading.present();
        let body = {
          "host": this.hostP,
          "username": this.user,
          "password": this.pass,
          "ports": this.switchports,
          "allowed": this.allowed,
        
        }
        this.http.post('http://127.0.0.1:5000/trunk', body, { responseType: 'text' }).subscribe((response) => {

          this.presentAlert(response);
          loading.dismiss();
        }, error => {
          loading.dismiss();
        });
        
        this.hostP ="";
        this.allowed=[];
        this.switchports=[];
        for (let entry of this.ports) {
          entry.isChecked=false;
          } 
      }

    }
    //Access Mode
    else if (mode == "access"){
      if ( (this.access_vlan=="") || (this.ports.length< 1) || (this.hostP=="") ){
        this.presentAlert("All the inputs fields have  to be filled");
      }
      else if ( (!this.regex.test(this.hostP)) ) {
        this.presentAlert("Make sure to type in a valid IP Address!");
      }
      else if  (!this.regexVlan.test(this.access_vlan)){
        this.presentAlert("Type in a valid VLAN name!")
      }
      else {
        const loading = await this.loadingCtrl.create({
          message: "Please wait",
          translucent: true,
  
        });
  
        await loading.present();
        let body = {
          "host": this.hostP,
          "username": this.user,
          "password": this.pass,
          "ports": this.switchports,
          "access_vlan": this.access_vlan,
        
        }
        this.http.post('http://127.0.0.1:5000/access', body, { responseType: 'text' }).subscribe((response) => {

          this.presentAlert(response);
          loading.dismiss();
        }, error => {
          loading.dismiss();
        });
        
        this.hostP ="";
        this.switchports=[];
        this.access_vlan="";
        for (let entry of this.ports) {
          entry.isChecked=false;
          } 
      }
    }

    
  }

/*****************************Router******************************************** */
/*****************************CONFIGURE INTERFACES******************************************** */

async configureInt(){
  this.H= this.regex.test(this.hostRInt);
  this.I=this.regex.test(this.r_ip);
  this.J=this.regex.test(this.r_mask);



  if ((this.Rinterface=="") || (this.hostRInt == "") ||(this.r_ip == "") || (this.r_mask == "")) 
     {
        this.presentAlert("All the inputs fields have  to be filled");
      }
      else if ( !( this.H && this.I && this.J)){
        this.presentAlert("Make sure to type in a valid IP Address!");
      }
    
     
  
       else {
    
        const loading = await this.loadingCtrl.create({
          message: "Please wait",
          translucent: true,
  
        });
  
        await loading.present();
        let body = {
          "host": this.hostRInt,
          "username": this.user,
          "password": this.pass,
          "int": this.Rinterface,
          "ip": this.r_ip,
          "mask": this.r_mask,
         }
        this.http.post('http://127.0.0.1:5000/rint', body, { responseType: 'text' }).subscribe((response) => {

          this.presentAlert(response);
          loading.dismiss();
        }, error => {
          loading.dismiss();
        });
        this.hostRInt = "";
        this.r_ip ="";
        this.r_mask="";
        this.Rinterface="";
        
      
      }
      


}
   

  async configureRouter(){
      
   
   if (((this.neighbors.length < 1) ||  (this.hostR == "") )) {
     this.presentAlert("All the inputs fields have  to be filled");
   }
   else if (!(this.regex.test(this.hostR)))  {
     this.presentAlert("Make sure to type in a valid IP Address!");
   }


   else {
     const loading = await this.loadingCtrl.create({
       message: "Please wait",
       translucent: true,

     });

     await loading.present();
     let body = {
       "host_ip": this.hostR,
       "username": this.user,
       "password": this.pass,
       "neighbors": this.neighbors
     }

     this.http.post('http://127.0.0.1:5000/router', body, { responseType: 'text' }).subscribe((response) => {

       this.presentAlert(response);
       loading.dismiss();
     }, error => {
       loading.dismiss();
     });
    
     this.hostR = "";
     this.neighbors = [];
     

   }


 }

/*****************************Get Configurations******************************************** */

async getConfig(){
  if (( this.confHost == "" )) {
    this.presentAlert("All the inputs fields have  to be filled");
  }
  else if ((!this.regex.test(this.confHost)) ) {
    this.presentAlert("Make sure to type in a valid IP Address!")
  }


  else {
    const loading = await this.loadingCtrl.create({
      message: "Please wait",
      translucent: true,

    });

    await loading.present();
    let body = {
      "host_ip": this.confHost,
      "username": this.user,
      "password": this.pass,
        }

    this.http.post('http://127.0.0.1:5000/conf', body, { responseType: 'text' }).subscribe((response) => {
      this.configuration= response;
      this.configuration=this.configuration.replace(/(?:\r\n|\r|\n)/g, ' <br> ');
      this.clear=true;
      loading.dismiss();
    }, error => {
      loading.dismiss();
    });
  

    
    
  }
  



}


}



















