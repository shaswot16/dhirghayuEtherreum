import React, { useState } from 'react'

const Display = ({contract,account}) => {
  const [data,setData]=useState("");

  const getdata = async()=>{
    let dataArray;
    const Otheraddress = document.querySelector(".address").value;
    //console.log("OtherAddress",Otheraddress)
    
    if(Otheraddress){
      dataArray=await contract.display(Otheraddress);
      console.log(dataArray)
    }else{
      dataArray= await contract.display(account);
      //console.log("DataArray",dataArray);
    }
    const isEmpty = Object.keys(dataArray).length===0;

    if(!isEmpty){
      const str = dataArray.toString();
      const str_array = str.split(",");
      console.log("str_array",str_array);
    }
  };
  return (
    <>
    <div>Image Display</div>
    <input type="text" className='address' placeholder='Enter Address'/>
    
    <button onClick={getdata}>Get Data</button>
    </>
  )
}

export default Display