import { ref, onMounted } from "vue";
export const useCheckVersion = () => {
    let needRefresh = ref(false);
    let version = ref();
    const getLocalVersion = () =>{
        return localStorage.getItem("version") || '';
    };

    const setLocalVersion = () =>{
        localStorage.setItem("version", version.value);
    };

    const checkVersion = ()=>{
        try {
            if(!import.meta.env.PROD) return;
            fetch('/version.json'+'?t='+Date.now())
            .then(res=>res.json())
            .then(data=>{
                console.log('当前版本号:', data.version,'本地版本号:', getLocalVersion());
                if(String(data.version) !== getLocalVersion()){
                    version.value = data.version;
                    if(!getLocalVersion()){
                        setLocalVersion();
                        needRefresh.value = false;
                    } else {
                        needRefresh.value = true;
                    }
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
        localStorage.removeItem("version");
        checkVersion();
        // 每5秒检查一次版本号
        setInterval(checkVersion,5000);
    });
    return {
        needRefresh,
        refreshPage,
        setLocalVersion
    }
}