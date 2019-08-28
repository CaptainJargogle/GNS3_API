
from flask import Flask, request, jsonify 
import socket
import paramiko
from paramiko.ssh_exception import BadHostKeyException, AuthenticationException, SSHException
import paramiko
import time

app= Flask(__name__) 

#########################################################   TEST CONNECTION (Only for testting purposes)  #################################################################################
@app.route('/connection',methods =["POST"])
def connection():

    data= request.get_json()
    ip_address = data["ip_address"]
    username = data["username"]
    password = data["password"]
    try:
        ssh_client = paramiko.SSHClient()
        ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh_client.connect(hostname=ip_address,username=username,password=password)
    except (BadHostKeyException):
        
        return ("Host key could not be verified!")
    
    except (AuthenticationException):
        return ("Check Username/Password combination!")
    
    except (SSHException):
        return ("Error while connecting or establishing an SSH session!")
    
    except (socket.error):
        return ("Socket Error!")
    
    
    else:

        ssh_client.close 
        return ("Connection was successful!")
   

#########################################################   L3 Switches  #################################################################################
  


#Configure Switch LoopInt
@app.route('/switch',methods =["POST"])
def switch():

    data= request.get_json()
    ip_address = data["ip_address"]
    username = data["username"]
    password = "admin"
    try:
        ssh_client = paramiko.SSHClient()
        ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh_client.connect(hostname=ip_address,username=username,password=password)
    except (BadHostKeyException):
        
        return ("Host key could not be verified!")
    
    except (AuthenticationException):
        return ("Check Username/Password combination!")
    
    except (SSHException):
        return ("Error while connecting or establishing an SSH session!")
    
    except (socket.error):
        return ("Socket Error!")
    
    
    else:
        
        remote_connection = ssh_client.invoke_shell()
        remote_connection.send("configure terminal\n")
        remote_connection.send("int loop 3\n")
        remote_connection.send("ip address 1.1.1.4 255.255.255.255\n")
        remote_connection.send("int loop 4\n")
        remote_connection.send("ip address 2.2.2.5 255.255.255.255\n")
        remote_connection.send("router ospf 1\n")
        remote_connection.send("network 0.0.0.0 255.255.255.255 area 0\n")
        remote_connection.send("end\n")
        time.sleep(1)
        output = remote_connection.recv(65535)
        print (output)

        ssh_client.close 
        return ("Configuration was successful")
        
    


#Creating VLANS
@app.route('/createVlan',methods =["POST"])
def createVlan():
    data= request.get_json()
    hosts = data["hosts"]
    username=data["username"]
    password=data["pass"]
    num= data["numOfVLANS"]
    
    
    for h in hosts:
            
        try:
            print("trying host " + h)
            ssh_client = paramiko.SSHClient()
            ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            ssh_client.connect(hostname=h,username=username,password=password)
        except (BadHostKeyException):
            
            return ("Host key could not be verified!")
        
        except (AuthenticationException):
            return ("Check Username/Password combination!")
    
        except (SSHException):
            return ("Error while connecting or establishing an SSH session!")
        
        except (socket.error):
            return ("Socket Error!")
        
        
        else:
            remote_connection = ssh_client.invoke_shell()
            remote_connection.send("configure terminal\n")
            for n in range (2,(num+2)):
                print ("Creating VLAN " + str(n))
                remote_connection.send("vlan " + str(n) +  "\n")
                remote_connection.send("name Python_VLAN " + str(n) +  "\n")
                print ("Creating VLAN " + str(n))
             #remote_connection.send("copy run start\n")
             #remote_connection.send("startup-config\n")
            remote_connection.send("end\n")
            time.sleep(0.5)
            ssh_client.close

    return "Sucessfully Created VLANs"




#Configuring VLANS
@app.route('/configureVlan',methods =["POST"])
def configureVlan():
    data= request.get_json()
    ip_address = data["ip_address"]
    username = data["username"]
    password = data["password"]
    vlan= data["vlan"]
    vlan_ip= data["vlan_ip"]
    vlan_mask= data["vlan_mask"]
    
    try:
        ssh_client = paramiko.SSHClient()
        ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh_client.connect(hostname=ip_address,username=username,password=password)
    except (BadHostKeyException):
        
        return ("Host key could not be verified!")
    
    except (AuthenticationException):
        return ("Check Username/Password combination!")
    
    except (SSHException):
        return ("Error while connecting or establishing an SSH session!")
    
    except (socket.error):
        return ("Socket Error!")
    
    
    else:
        remote_connection = ssh_client.invoke_shell()
        print("Start Configuration VLAN" + vlan)
        remote_connection.send("configure terminal\n")
        remote_connection.send("ip routing \n") 
        remote_connection.send("int vlan "+ vlan +"\n")
        remote_connection.send("ip address "+ vlan_ip+" " + vlan_mask + "\n")
        remote_connection.send("no shutdown\n")
        remote_connection.send("end\n")
        print("Finish Configuration VLAN" + vlan)
        #remote_connection.send("copy run start\n")
        #remote_connection.send("startup-config\n")
        time.sleep(0.5)
        ssh_client.close 
        return "Successfully configured VLAN!"


        
#Configure Routing
@app.route('/routing',methods =["POST"])
def routing():
    data= request.get_json()
    host = data["host_ip"]
    username = data["username"]
    password = data["password"]
    interface= data["interface"]
    ip=data["ip_add"]
    mask=data["mask"]
    networks= data["networks"]
    
    
    try:
        ssh_client = paramiko.SSHClient()
        ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh_client.connect(hostname=host,username=username,password=password)
    except (BadHostKeyException):
        
        return ("Host key could not be verified!")
    
    except (AuthenticationException):
        return ("Check Username/Password combination!")
    
    except (SSHException):
        return ("Error while connecting or establishing an SSH session!")
    
    except (socket.error):
        return ("Socket Error!")
    
    
    else:
        remote_connection = ssh_client.invoke_shell()
        remote_connection.send("configure terminal\n")
        remote_connection.send("ip routing\n")
        remote_connection.send("int " + interface + "\n")
        print ("Entered Interface" + interface)
        remote_connection.send("no switchport\n")
        remote_connection.send("ip address " + ip + " " + mask + "\n")
        remote_connection.send("no shutdown\n")
        remote_connection.send("exit\n")
        print("Starting Router Conf")
        remote_connection.send("router eigrp 1\n")
        remote_connection.send("no auto-summary\n")
        for network in networks:
            print (network)
            remote_connection.send("network " + network +"\n")
        print("Finished Router Conf")
        remote_connection.send("end\n")
        #remote_connection.send("copy run start\n")
        #remote_connection.send("startup-config\n")
        time.sleep(0.5)
        ssh_client.close 
        return "Routing successfully configured!"


#Configure DHCP Server
@app.route('/dhcp',methods =["POST"])
def dhcp():
    data= request.get_json()
    host = data["host"]
    username = data["username"]
    password = data["password"]
    pool_name = data["pool"]
    network= data["network"]
    mask=data["mask"]
    router=data["router"]
    addresses= data["addresses"]
    
    
    try:
        ssh_client = paramiko.SSHClient()
        ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh_client.connect(hostname=host,username=username,password=password)
    except (BadHostKeyException):
        
        return ("Host key could not be verified!")
    
    except (AuthenticationException):
        return ("Check Username/Password combination!")
    
    except (SSHException):
        return ("Error while connecting or establishing an SSH session!")
    
    except (socket.error):
        return ("Socket Error!")
    
    
    else:
        remote_connection = ssh_client.invoke_shell()
        remote_connection.send("configure terminal\n")
        remote_connection.send("service dhcp\n")
        remote_connection.send("ip dhcp pool " + pool_name + "\n")
        print ("pool " + pool_name + " set up")
        remote_connection.send("network "+ network + " "+ mask+ "\n")
        print ("Configured Pool")
        remote_connection.send("default-router " + router + "\n")
        remote_connection.send("exit\n")
        print("excluded addresses")
        for address in addresses:
            print (address)
            remote_connection.send("ip dhcp excluded-address " + address +"\n")
        print("Finished Conf")
        remote_connection.send("end\n")
        #remote_connection.send("copy run start\n")
        #remote_connection.send("startup-config\n")
        time.sleep(0.5)
        ssh_client.close 
        return "DHCP Server successfully configured!"

#Configure Trunk Ports
@app.route('/trunk',methods =["POST"])
def trunk():
    data= request.get_json()
    host = data["host"]
    username = data["username"]
    password = data["password"]
    ports = data["ports"]
    allowed= data["allowed"]
    myString="switchport trunk allowed vlan "
    
    
    try:
        ssh_client = paramiko.SSHClient()
        ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh_client.connect(hostname=host,username=username,password=password)
    except (BadHostKeyException):
        
        return ("Host key could not be verified!")
    
    except (AuthenticationException):
        return ("Check Username/Password combination!")
    
    except (SSHException):
        return ("Error while connecting or establishing an SSH session!")
    
    except (socket.error):
        return ("Socket Error!")
    
    
    else:
        for a in allowed:
            myString=myString+ a+","
        myString=myString+"1-2,1002-1005"    
        remote_connection = ssh_client.invoke_shell()
        remote_connection.send("configure terminal\n")
        for p in ports:
            remote_connection.send("int " + p + "\n")
            print ("entered interface "+ p)
            remote_connection.send("switchport\n")
            print(myString)
            remote_connection.send(myString +"\n")
            remote_connection.send("switchport trunk encapsulation dot1q\n")
            remote_connection.send("switchport mode trunk\n")
            remote_connection.send("no shutdown\n")
            remote_connection.send("exit\n")
            print("Finished Conf")
        remote_connection.send("end\n")
        #remote_connection.send("copy run start\n")
        #remote_connection.send("startup-config\n")
        time.sleep(0.5)
        ssh_client.close 
        return "Trunks have been sucessfully configured!"



#Configure Access Ports
@app.route('/access',methods =["POST"])
def access():
    data= request.get_json()
    host = data["host"]
    username = data["username"]
    password = data["password"]
    ports = data["ports"]
    vlan= data["access_vlan"]
    
    
    
    try:
        ssh_client = paramiko.SSHClient()
        ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh_client.connect(hostname=host,username=username,password=password)
    except (BadHostKeyException):
        
        return ("Host key could not be verified!")
    
    except (AuthenticationException):
        return ("Check Username/Password combination!")
    
    except (SSHException):
        return ("Error while connecting or establishing an SSH session!")
    
    except (socket.error):
        return ("Socket Error!")
    
    
    else:
        remote_connection = ssh_client.invoke_shell()
        remote_connection.send("configure terminal\n")
        for p in ports:
            remote_connection.send("int " + p + "\n")
            print ("entered interface "+ p)
            remote_connection.send("switchport\n")
            remote_connection.send("switchport mode access\n")
            remote_connection.send("switchport access vlan "+ vlan + "\n")
            remote_connection.send("no shutdown\n")
            remote_connection.send("exit\n")
            print("Finished Conf")
        remote_connection.send("end\n")
        #remote_connection.send("copy run start\n")
        #remote_connection.send("startup-config\n")
        time.sleep(0.5)
        ssh_client.close 
        return "Access Ports have been sucessfully configured!"



#########################################################   Routers  #################################################################################3


#Configure Router Interfaces
@app.route('/rint',methods =["POST"])
def rint():
    data= request.get_json()
    host = data["host"]
    username = data["username"]
    password = data["password"]
    interface = data["int"]
    ip= data["ip"]
    mask= data["mask"]
    
    
    
    try:
        ssh_client = paramiko.SSHClient()
        ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh_client.connect(hostname=host,username=username,password=password)
    except (BadHostKeyException):
        
        return ("Host key could not be verified!")
    
    except (AuthenticationException):
        return ("Check Username/Password combination!")
    
    except (SSHException):
        return ("Error while connecting or establishing an SSH session!")
    
    except (socket.error):
        return ("Socket Error!")
    
    
    else:
        remote_connection = ssh_client.invoke_shell()
        remote_connection.send("configure terminal\n")
        remote_connection.send("int "+ interface +"\n")
        remote_connection.send("ip address " + ip + " " + mask + "\n")
        remote_connection.send("no shutdown\n")
        remote_connection.send("end\n")
        #remote_connection.send("copy run start\n")
        #remote_connection.send("startup-config\n")
        time.sleep(0.5)
        ssh_client.close 
        return "Interface has been sucessfully configured!"




#Configure Routing
@app.route('/router',methods =["POST"])
def router():
    data= request.get_json()
    host = data["host_ip"]
    username = data["username"]
    password = data["password"]
    networks= data["neighbors"]
    
    
    try:
        ssh_client = paramiko.SSHClient()
        ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh_client.connect(hostname=host,username=username,password=password)
    except (BadHostKeyException):
        
        return ("Host key could not be verified!")
    
    except (AuthenticationException):
        return ("Check Username/Password combination!")
    
    except (SSHException):
        return ("Error while connecting or establishing an SSH session!")
    
    except (socket.error):
        return ("Socket Error!")
    
    
    else:
        remote_connection = ssh_client.invoke_shell()
        remote_connection.send("configure terminal\n")
        print("Starting Router Conf")
        remote_connection.send("router eigrp 1\n")
        remote_connection.send("no auto-summary\n")
        for network in networks:
            print (network)
            remote_connection.send("network " + network +"\n")
        print("Finished Router Conf")
        remote_connection.send("end\n")
        #remote_connection.send("copy run start\n")
        #remote_connection.send("startup-config\n")
        time.sleep(0.5)
        ssh_client.close 
        return "Routing successfully configured!"






#Get Confioguration
@app.route('/conf',methods =["POST"])
def conf():
    data= request.get_json()
    host = data["host_ip"]
    username = data["username"]
    password = data["password"]
    
    
    
    
    try:
        ssh_client = paramiko.SSHClient()
        ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh_client.connect(hostname=host,username=username,password=password)
    except (BadHostKeyException):
        
        return ("Host key could not be verified!")
    
    except (AuthenticationException):
        return ("Check Username/Password combination!")
    
    except (SSHException):
        return ("Error while connecting or establishing an SSH session!")
    
    except (socket.error):
        return ("Socket Error!")
    
    
    else:
        
        remote_connection = ssh_client.invoke_shell()
        remote_connection.send("terminal length 0\n")
        remote_connection.send("show run brief\n")
        time.sleep(10) #to wait untill the configuration is built
        readoutput=remote_connection.recv(65535)
        readoutput=readoutput.decode("utf-8")
        b=readoutput.find("Current configuration")
        e=len(readoutput)
        output=readoutput[b: e-12]
        ssh_client.close 
        return (output)














app.run(debug=True)