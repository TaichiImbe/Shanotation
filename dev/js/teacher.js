let filter = new Map();

let teacherFilter = {
    setFilter: (str, pageNum) => {
        if (filter.has(pageNum)) {
            let array = filter.get(pageNum);    
            if (str) {
                str.forEach(element => {
                    array.push(element); 
                });
                filter.set(pageNum, array);
            }
        } else {
            if (str) {
                filter.set(pageNum, str);
            }
        }
    },
    checkFilter: (str,pageNum) => {
        if (filter.has(pageNum)) {
            let d = filter.get(pageNum)
            for (let i = 0; i < d.length; i++){
                if (str.str === d[i].str && str.transform[4] === d[i].transform[4] && str.transform[5] === d[i].transform[5]) {
                    return true;
                }
            }
            return false;
        } else {
            return false;
        }
    }
}

global.teacherFilter = teacherFilter;