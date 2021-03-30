module.exports = {
  sleep: function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  makeid: function (length = 12, length2 = 12, length3 = 12) {
    let result           = '',
        result2          = '',
        result3          = '',
        characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    for (let o = 0; o < length2; o++) {
      result2 += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    for (let h = 0; h < length3; h++) {
      result3 += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result + '-' + result2 + '-' + result3;
  },
};
