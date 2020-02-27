let filter = new Map();

let teacherFilter = {
    setFilter: (str, pageNum) => {
        console.log(str);
        if (filter.has(pageNum)) {
            let array = filter.get(pageNum);    
            str.forEach(element => {
                array.push(element); 
            });
            filter.set(pageNum, array);
        } else {
            filter.set(pageNum, str);
        }
    },
    checkFilter: (str,pageNum) => {
        console.log(str);
        if (filter.has(pageNum)) {
            let d = filter.get(pageNum)
            for (let i = 0; i < d.length; i++){
                if (str.str === d[i].str) {
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