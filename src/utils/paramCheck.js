const rules = {
    number: /^[-+]?(([0-9]+)([.]([0-9]+))?|([.]([0-9]+))?)$/
}
// var pattern = /^[-+]?(([0-9]+)([.]([0-9]+))?|([.]([0-9]+))?)$/,
//     str = '0124353533';
// console.log(pattern.test(str));
//与预期相同时返回父级对象的期待字段值 必传参数值没有或类型不正常时主动报错停止运行

function paramCheck(target, rule, defaultVaule) {
    if (!rule) {
        console.log("没有检查规则直接返回原值", target);
        return false;
    } else {
        if (rules[rule].test(target)) {//符合规则检查直接返回 
            console.log("合法参数", target);
            return target;
        } else {
            if (defaultVaule) {
                console.log("不和法参数返回默认值", target);
                return defaultVaule
            } else {
                console.log("不合法参数且没有默认值返回false", target)
                return false
            }
        }
    }
}
export {
    paramCheck
}