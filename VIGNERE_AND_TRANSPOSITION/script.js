let encryptedMessage = ""; // Variable pour stocker le message chiffré

function encrypt() {
    const message = document.getElementById("message").value;
    const key = document.getElementById("key").value;
    const { cipher, matrix } = encryptMessage(message, key);
    encryptedMessage = message; // Stocke le message chiffré dans la variable encryptedMessage
    document.getElementById("output").textContent = "Encrypted Message: " + cipher;
    displaySteps("Encryption Steps", matrix, "encryptionSteps");
}

function getEncryptedMessage() {
    return encryptedMessage; // Retourne le message chiffré stocké dans la variable encryptedMessage
}


function decrypt() {
    const encryptedMessage = document.getElementById("message").value;
    const key = document.getElementById("key").value;
    const { decryptedMessage, matrix } = decryptMessage(encryptedMessage, key);
    document.getElementById("output").textContent = "Decrypted Message: " + decryptedMessage;
    displaySteps("Decryption Steps", matrix, "decryptionSteps");
}

function encryptMessage(msg, key) {
    let cipher = "";
 
    // track key indices
    let k_indx = 0;
 
    const msg_len = msg.length;
    const msg_lst = Array.from(msg);
    const key_lst = Array.from(key).sort();
 
    // calculate column of the matrix
    const col = key.length;
 
    // calculate maximum row of the matrix
    const row = Math.ceil(msg_len / col);
 
    // add the padding character '_' in empty
    // the empty cell of the matrix
    const fill_null = (row * col) - msg_len;
    for (let i = 0; i < fill_null; i++) {
        msg_lst.push('_');
    }
 
    // create Matrix and insert message and
    // padding characters row-wise
    const matrix = [];
    for (let i = 0; i < msg_lst.length; i += col) {
        matrix.push(msg_lst.slice(i, i + col));
    }
 
    // read matrix column-wise using key
    for (let _ = 0; _ < col; _++) {
        const curr_idx = key.indexOf(key_lst[k_indx]);
        for (const row of matrix) {
            cipher += row[curr_idx];
        }
        k_indx++;
    }
    return { cipher, matrix };
}

function decryptMessage(cipher, key) {
    let msg = "";
    let k_indx = 0;
    let msg_indx = 0;
    const msg_len = cipher.length;
    const msg_lst = Array.from(cipher);

    const col = key.length;
    const row = Math.ceil(msg_len / col);
    const key_lst = Array.from(key).sort();

    const dec_cipher = [];
    for (let i = 0; i < row; i++) {
        dec_cipher.push(Array(col).fill(null));
    }

    for (let _ = 0; _ < col; _++) {
        const curr_idx = key.indexOf(key_lst[k_indx]);

        for (let j = 0; j < row; j++) {
            dec_cipher[j][curr_idx] = msg_lst[msg_indx];
            msg_indx++;
        }
        k_indx++;
    }

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            if (dec_cipher[i][j] !== '_') {
                msg += dec_cipher[i][j];
            }
        }
    }

    return { decryptedMessage: msg, matrix: dec_cipher };
}




function displaySteps(title, matrix, targetId) {
    const table = document.createElement("table");
    let html = `<tr><th>${title}</th>`;
    for (let i = 0; i < matrix[0].length; i++) {
        html += `<th>Column ${i + 1}</th>`;
    }
    html += "</tr>";
    for (let i = 0; i < matrix.length; i++) {
        html += `<tr><td>Step ${i + 1}</td>`;
        for (let j = 0; j < matrix[i].length; j++) {
            html += `<td>${matrix[i][j]}</td>`;
        }
        html += "</tr>";
    }
    table.innerHTML = html;
    document.getElementById(targetId).innerHTML = `<h2>${title}</h2>`;
    document.getElementById(targetId).appendChild(table);
}
function cryptoAnalyse() {
    const encryptedMessage = document.getElementById("message").value;
    const uniqueCharacters = [...new Set(encryptedMessage.replace(/_/, '').split(''))];
    const permutations = getPermutations(encryptedMessage, uniqueCharacters.length);

    let previousWord = getEncryptedMessage();
    let outputHTML = "<h2>Possible Decrypted Messages:</h2><table><tr>"; // Ouvrir la première ligne du tableau

    let columnIndex = 0; // Variable pour suivre la colonne actuelle

    for (const [index, permutation] of permutations.entries()) {
        const { decryptedMessage, matrix } = decryptMessage(permutation, uniqueCharacters.join(''));

        const colorClass = decryptedMessage === previousWord ? 'green' : '';
        outputHTML += `<td class="${colorClass}">${decryptedMessage}</td>`;

        columnIndex++;

        if (index % 2 !== 0) {
            outputHTML += "</tr><tr>"; 
            columnIndex = 0; 
        }
        
        displaySteps("Decryption Steps", matrix, "decryptionSteps");
    }

    // Fermer la dernière ligne du tableau
    outputHTML += "</tr></table>";
    document.getElementById("cryptoAnalysis").innerHTML = outputHTML;
}



// Fonction pour générer toutes les permutations d'une chaîne
function getPermutations(string, length) {
    if (length === 1) {
        return string.split('');
    }
    const permutations = [];
    const smallerPermutations = getPermutations(string, length - 1);
    for (const [index, char] of string.split('').entries()) {
        for (const smallerPermutation of smallerPermutations) {
            if (!smallerPermutation.includes(char)) {
                permutations.push(smallerPermutation.slice(0, index) + char + smallerPermutation.slice(index));
            }
        }
    }
    return permutations;
}
