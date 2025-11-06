import { ref, onMounted } from "vue";

export const useCheckVersion = () => {
    let needRefresh = ref(false);
    const getLocalVersion = () =>{
        return localStorage.getItem("version") || '';
    };

    const setLocalVersion = (newVersion) =>{
        localStorage.setItem("version", newVersion);
    };

    const checkVersion = ()=>{
        try {
            if(!import.meta.env.PROD) return;
            fetch('/version.json')
            .then(res=>res.json())
            .then(data=>{
                console.log('当前版本号:', data,'本地版本号:', getLocalVersion());
                if(String(data.version) !== getLocalVersion()){
                    needRefresh.value = true;
                    setLocalVersion(data.version);
                }
            })
        } catch (error) {
            console.error('检查版本号失败:', error);
        }
    };

    const refreshPage = ()=>{
        window.location.reload(true);
    }
    onMounted(()=>{
        checkVersion();
        // 每5秒检查一次版本号
        setInterval(checkVersion,5000);
    });
    return {
        needRefresh,
        refreshPage
    }
}