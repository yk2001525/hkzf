import axios from 'axios'
export const getCurrentCity = () => {
  const localCity = JSON.parse(localStorage.getItem("hkzf_city"));
  if (!localCity) {
    // 通过ip定位获取到当前城市的名称
   return new Promise((resolve,reject)=>{
    const curCity = new window.BMapGL.LocalCity();
    curCity.get(async (res) => {
        try{
            const result = await axios.get(
                `http://localhost:8080/area/info?name=${res.name}`
              );
              
            //   存储到本地存储中
            localStorage.setItem('hkzf_city',JSON.stringify(result.data.body))
            // 返回城市数据
            resolve(result.data.body)
            
        }catch(e){
            // 获取定位城市失败
            reject(e)
        }
    });
   })
  }else{
    //   因为此处的promise不会失败，所以，此处只要返回一个成功的promise即可
    return Promise.resolve(localCity)
  }
};
