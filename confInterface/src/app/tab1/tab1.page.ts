import { Component } from '@angular/core';
import { SshService } from "../provider/ssh.service";
import { PickerController } from '@ionic/angular';
import { PickerOptions } from '@ionic/core';





@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  
  
  create: boolean;
  configure: boolean;
  routing:boolean;
  dhcp:boolean;
  port: boolean;
  trunk: boolean;
  access: boolean;
  radioValue="1";
  radioValue2="1";
  
  

  
 
  

  
  constructor(private ssh: SshService,  private pickerCtrl:PickerController ) {
 
    
    
  }

  
//*****************************FOR THE RADIO BUTTONS******************************************** */
  showValue(){
    console.log(this.radioValue);
    switch(this.radioValue){
      case "create":{
        this.create=true;
        this.configure=false;
        this.routing=false;
        this.dhcp=false;
        this.port=false;
        break;
      }
      case "configure":{
        this.create=false;
        this.configure=true;
        this.routing=false;
        this.dhcp=false;
        this.port=false;
        break;
      }
      case "routing":{
        this.create=false;
        this.configure=false;
        this.routing=true;
        this.dhcp=false;
        this.port=false;
        break;
      }
      case "dhcp":{
        this.create=false;
        this.configure=false;
        this.routing=false;
        this.dhcp=true;
        this.port=false;
        break;
      }
      case "port":{
        this.create=false;
        this.configure=false;
        this.routing=false;
        this.dhcp=false;
        this.port=true;
        break;
      }

    }

  }


  showValue2(){
    console.log(this.radioValue2);
    switch(this.radioValue2){
      case "trunk":{
        this.trunk=true;
        this.access=false;
        break;
      }
      case "access":{
        this.trunk=false;
        this.access=true;
        break;
      }
    }


  }
  
  //*****************************TO CREATE VLANs******************************************** */
  AddHost(){
    this.ssh.AddStuff(this.ssh.hosts,this.ssh.hostIp);
    this.ssh.hostIp="";
    console.log(this.ssh.hosts);
    
    }  

  
  createVlan(){
    this.ssh.createVlan();
    console.log(this.ssh.num);
  }


  //*****************************TO CONFIGURE A VLAN******************************************** */
  
  configureVlan(){
    this.ssh.configureVlan();
    
    console.log(this.ssh.vlan);
    console.log(this.ssh.vlan_ip);
    console.log(this.ssh.vlan_mask);
    
  }
  
  //*****************************TO CONFIGURE ROUTING******************************************** */
 
  async showBasicPicker(){
    let opts: PickerOptions={
      buttons: [
        {
          text: "Cancel",
          role: "cancel"
        },
        {
          text: "Done"
        }
        

      ],
      columns: [{
        name: 'Interface',
        options: [
          {text : "f1/0", value :"f1/0"},
          {text : "f1/1", value :"f1/1"},
          {text : "f1/2", value :"f1/2"},
          {text : "f1/3", value :"f1/3"},
          {text : "f1/4", value :"f1/4"},
          {text : "f1/5", value :"f1/5"},
          {text : "f1/6", value :"f1/6"},
          {text : "f1/7", value :"f1/7"},
          {text : "f1/8", value :"f1/8"},
          {text : "f1/9", value :"f1/9"},
          {text : "f1/10", value :"f1/10"},
          {text : "f1/11", value :"f1/11"},
          {text : "f1/13", value :"f1/12"},
          {text : "f1/14", value :"f1/14"},
          {text : "f1/15", value :"f1/15"},
          {text : "f2/0", value :"f2/0"},
        ]
        

      }]

    };
    let picker= await this.pickerCtrl.create(opts);
    picker.present();
    picker.onDidDismiss().then(async data =>{
      let col = await picker.getColumn("Interface");
      this.ssh.interface= col.options[col.selectedIndex].text;
      console.log(this.ssh.interface);
      
    });


  }
  
 
  AddNetwork(){
    this.ssh.AddStuff(this.ssh.addresses,this.ssh.ipAdd);
    this.ssh.ipAdd="";
    console.log(this.ssh.addresses);
    
  }

 configureRouting(){
      this.ssh.configureRouting();

    }

    //*****************************TO CONFIGURE DHCP SERVER******************************************** */
    AddExcluded(){
      this.ssh.AddStuff(this.ssh.dhcp_addresses,this.ssh.excluded);
    this.ssh.excluded="";
    console.log(this.ssh.dhcp_addresses);
    }
 
     configureDHCP(){
      this.ssh.configureDHCP();
         
    }

      //*****************************TO CONFIGURE PORTS******************************************** */
      AddVlansAllowed(){
        this.ssh.AddVlans(this.ssh.allowed,this.ssh.allow);
        this.ssh.allow="";
        console.log(this.ssh.allowed);
        
      }


      configurePorts(){
        if (this.trunk){
        this.ssh.configurePorts("trunk");
      }  
      else if (this.access){
        this.ssh.configurePorts("access");
      }
      
      
      
      
      
        }





  }
