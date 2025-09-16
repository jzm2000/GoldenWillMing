function useCssVariables(){
    const root = document.documentElement;
    const rootStyles = getComputedStyle(root);
    function getVariable(variableName){
        return rootStyles.getPropertyValue(variableName);
    };
    function setVariable(variableName,value){
        root.style.setProperty(variableName,value);
    };
    return {
        getVariable,
        setVariable
    }
}
export default useCssVariables;