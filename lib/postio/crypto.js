const crypto = require('crypto');

module.exports = {
    /** MD5 hash **/
    md5: function(data, key) {
        var md5 = crypto.createHash('md5');
        md5.update(data + key);
        return md5.digest('hex');
    },
    /** **/
    aes: {
        encode: function(data, key) {
            var cipher = crypto.createCipher('aes-256-ctr', key);
            var crypted = cipher.update(data, 'utf8', 'hex');
            crypted += cipher.final('hex');
            return crypted;
        },

        decode: function(data, key) {
            var decipher = crypto.createDecipher('aes-256-ctr', key)
            var dec = decipher
            .update(data, 'hex', 'utf8')
            dec += decipher.final('utf8');
            return dec;
        }
    }
}
