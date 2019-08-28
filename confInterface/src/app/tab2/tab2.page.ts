import { Component } from '@angular/core';
import { SshService } from '../provider/ssh.service';
import { PickerController } from '@ionic/angular';
import { PickerOptions } from '@ionic/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor( private ssh: SshService, private pickerCtrl:PickerController) {}

radio="1";  
interface: boolean;
routing: boolean;


showValue(){
  console.log(this.radio);
  switch(this.radio){
    case "interface":{
      this.interface=true;
      this.routing=false;
      break;
    }
    case "routing":{
      this.interface=false;
      this.routing=true;
      break;
    }
  }

}




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
        {text : "f0/0", value :"f0/0"},
        {text : "f0/1", value :"f0/1"},
        {text : "f1/0", value :"f1/0"},
        {text : "f2/0", value :"f2/0"},
        {text : "s0/0", value :"s0/0"},
        {text : "s0/1", value :"s0/1"},
        {text : "s0/2", value :"s0/2"},
        {text : "s0/3", value :"s0/3"},
        {text : "s0/4", value :"s0/4"},
        {text : "s0/5", value :"s0/5"},
       
      ]
      

    }]

  };
  let picker= await this.pickerCtrl.create(opts);
  picker.present();
  picker.onDidDismiss().then(async data =>{
    let col = await picker.getColumn("Interface");
    this.ssh.Rinterface= col.options[col.selectedIndex].text;
    
    console.log(this.ssh.Rinterface);
   
    
    
  });


}

 //*****************************TO CONFIGURE INTERFACES******************************************** */
configureInt(){
  this.ssh.configureInt();

}

 //*****************************TO CONFIGURE ROUTING******************************************** */

AddNeighbors(){
  this.ssh.AddStuff(this.ssh.neighbors,this.ssh.neighbor);
    this.ssh.neighbor="";
    console.log(this.ssh.neighbors);

}

configureRouter(){
  this.ssh.configureRouter();
}


}