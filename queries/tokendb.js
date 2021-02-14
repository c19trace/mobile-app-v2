import React from 'react';
import SQLite from 'react-native-sqlite-storage';

// Runs the query and returns it to the calling method.
ExecuteQuery = (sql, params = []) => new Promise((resolve, reject) => {

    db.transaction((trans) => {
        trans.executeSql(sql, params, (trans, results) => {
        resolve(results);
        },
        (error) => {
            reject(error);
        });
    });
});


const SaveToken = async(token) =>{
    console.log("Storing token to database: ", token)
    await ExecuteQuery("CREATE TABLE IF NOT EXISTS tokens (id INTEGER PRIMARY KEY AUTOINCREMENT, token VARCHAR(32) NOT NULL UNIQUE)",[]);
    let singleInsert = await ExecuteQuery("INSERT INTO tokens (token) VALUES (?)", [token]);

}

const GetTokens = async() =>{
    await ExecuteQuery("CREATE TABLE IF NOT EXISTS tokens (id INTEGER PRIMARY KEY AUTOINCREMENT, token VARCHAR(32) NOT NULL UNIQUE)",[]);

    let selectQuery = await ExecuteQuery("SELECT token FROM tokens",[]);
    var rows = selectQuery.rows;
    var tokens = [rows]

    for (let i = 0; i < rows.length; i++) {
        var item = rows.item(i);
        //console.log(item.token);
        tokens[i] = item.token;
        //console.log(tokens[i])
    }
    return tokens;

}

export default class tokendb extends React.Component{

}

export { GetTokens, SaveToken }
