
export function randomPasswordGenerator(length = 8) {
    var charSet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890QWERT";
    var resultSet = "";
    for(let i=0; i<= length-1; i++){
        let random = Math.floor(Math.random()*(length-1+1)+1);
        resultSet += charSet.charAt(random);
    }

    return resultSet;
}

