$(function () {
    function generateUUID() {
        var d = new Date().getTime();
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    // encode a number to hex
    function decimalToHex(d, padding) {
        var hex = Number(d).toString(16);
        padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

        while (hex.length < padding) {
            hex = "0" + hex;
        }

        return hex;
    }

    // encode a string or byte array to hex
    function toHex(s) {
        // utf8 to latin1
        var h = '';
        for (var i = 0; i < s.length; i++) {
            h += decimalToHex(s[i]);
        }
        return h;
    }

    function toCPPCode(x) {
        r = "";
        for (var i = 0; i < x.length; i += 16) {
            for (var k = 0; k < 16 && k < x.length; k++) {
                r += "0x" + decimalToHex(x[i + k]) + ","
            }
            r += "\n";
        }
        return r;
    }

    function cppCode(pub, secret) {
        r = "/* ==== ECC KEYS ================= */\n" +
            "static unsigned char vrfyKey[crypto_sign_PUBLICKEYBYTES] = {\n";
        r += toCPPCode(pub);
        r += "};\n";
        r += "static unsigned char signKey[crypto_sign_SECRETKEYBYTES] = {\n";
        r += toCPPCode(secret);
        r += "};\n";
        return r;
    }

    $('#ecc-form').on('submit', function (e) {
        e.preventDefault();
        // get deviceId
        var data = $("#ecc-form").find("#id").serializeArray();
        var deviceId = data[0].value;

        if (deviceId !== "" && parseInt(deviceId, 16) !== 0) {
            keys = nacl.sign.keyPair();

            created = moment().utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
            validNotAfter = moment().add(1, 'y').utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
            pubKeyInfo = {
                "hwDeviceId": deviceId.toLowerCase(),
                "pubKey": nacl.util.encodeBase64(keys.publicKey),
                "pubKeyId": generateUUID(),
                "algorithm": "ed25519",
                "created": created,
                "validNotBefore": created,
                "validNotAfter": validNotAfter
            };
            var pubKeyInfoStr = JSON.stringify(pubKeyInfo, Object.keys(pubKeyInfo).sort());
            console.log(pubKeyInfoStr);
            var signature = nacl.sign.detached(nacl.util.decodeUTF8(pubKeyInfoStr), keys.secretKey);

            payload = {
                "pubKeyInfo": pubKeyInfo,
                "signature": nacl.util.encodeBase64(signature)
            };

            console.log(payload);

            $.ajax({
                type: "POST",
                url: "https://key.dev.ubirch.com/api/keyService/v1/pubkey",
                data: JSON.stringify(payload),
                contentType: 'application/json'
            }).fail(function(e) {
                console.log(e);
                alert("Public key submit failed!")
            }).done(function(r) {
                console.log(r);
                $('#pubkey').text(toHex(keys.publicKey));
                $('#prikey').text(toHex(keys.secretKey));
                $('#cpp').text(cppCode(keys.publicKey, keys.secretKey));
            });

        } else {
            alert("Calliope mini ID should be 8 hex characters!");
        }
    });
});
