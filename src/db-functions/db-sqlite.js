import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'Main.db', location: "default" },
  () => { },
  err => console.log(err)
)

export const CreateCategoriesTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS "categories" (
        "id"	INTEGER NOT NULL,
        "iconColor"	VARCHAR NOT NULL,
        "iconName"	VARCHAR NOT NULL,
        "name"	VARCHAR NOT NULL UNIQUE,
        PRIMARY KEY("id" AUTOINCREMENT)
      );`, [],
      () => { },
      err => console.log(err)
    )
  })
}

export const CreateTasksTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS "tasks" (
        "id"	INTEGER NOT NULL,
        "categoryId"	INTEGER NOT NULL,
        "name"	TEXT NOT NULL,
        "checked"	INTEGER DEFAULT 0,
        "Date" INTEGER NOT NULL,
        "scheduled" INTEGER NOT NULL,
        "scheduled_datetime" TEXT,
        PRIMARY KEY("id" AUTOINCREMENT)
        FOREIGN KEY(categoryId) REFERENCES categories(id)
        ON DELETE CASCADE
      );`, [],
      () => { },
      err => console.log(err)
    )
  })
}

export const insertCategory = ({ name, iconName, iconColor }) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `insert into categories (
          name,
          iconColor,
          iconName
          ) values (?, ?, ?);`,
        [name, iconColor, iconName],
        () => {
          resolve({
            stat: true,
            message: "Category added"
          })
        },
        err => {
          // console.log(err)
          reject({
            stat: false,
            message: "Category already exists"
          })
        }
      )
    })
  })
}

export const insertTask = (name, categoryId, scheduled, date) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      if (scheduled) {
        tx.executeSql(
          `insert into tasks (
            categoryId,
            name,
            "Date",
            "scheduled",
            "scheduled_datetime"
            ) values (?,?,?,?,?);`,
          [categoryId, name, Date.now(), scheduled, date],
          (tx, res) => {
            console.log(res.insertId)
            resolve({ stat: true, message: 'Task added', id: res.insertId })
          },
          err => {
            console.log(err)
            reject({ stat: false })
          }
        )
      } else {
        tx.executeSql(
          `insert into tasks (
            categoryId,
            name,
            "Date",
            "scheduled"
            ) values (?,?,?,?);`,
          [categoryId, name, Date.now(), false],
          (tx, res) => {
            resolve({ stat: true, message: 'Task added' })
          },
          err => {
            console.log(err)
            reject({ stat: false })
          }
        )
      }
    })
  })
}

export const SelectCategories = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `select * from categories order by id desc;`,
        [],
        (tx, res) => {
          let len = res.rows.length
          if (len > 0) {
            let results = []
            for (let i = 0; i < len; i++) {
              results.push(res.rows.item(i))
            }
            resolve({
              stat: true,
              res: results,
              len: len
            })
          } else {
            reject({ stat: false, message: "error in select categories" })
          }
        },
        err => {
          console.log(err)
          reject({ stat: false, message: "error in select categories 2" })
        }
      )
    })
  })
}

export const SelectCategoryColor = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `select iconColor from categories where id = ?;`,
        [id],
        (tx, res) => {
          let len = res.rows.length
          if (len === 1) {
            resolve(res.rows.item(0).iconColor)
          } else {
            // reject({ stat: false, message:"error in select cat color" })
            resolve('#000')
          }
        },
        err => {
          console.log(err)
          reject({ stat: false, message: "error in select cat color2" })
        }
      )
    })
  })
}

export const HandleCheck = (id, checked) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `update tasks set checked = ? where id = ? ;`,
        [!checked, id],
        (tx, res) => {
          resolve({ stat: true })
        },
        err => {
          console.log(err)
          reject({ stat: false })
        }
      )
    })
  })
}

export const getTaskDetails = (categoryId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `select count(checked) as "check" from tasks where checked = 0 and categoryId = ?;`,
        [categoryId],
        (tx, res) => {
          const unchecked = res.rows.item(0).check
          tx.executeSql(
            `select count(checked) as "check" from tasks where checked = 1 and categoryId = ?;`,
            [categoryId],
            (tx, res1) => {
              const checked = res1.rows.item(0).check
              resolve({
                progress: checked / (unchecked + checked),
                checked: checked,
                unchecked: unchecked
              })
            }
          )
        },
        err => {
          console.log(err)
        }
      )
    })
  })
}


export const SelectLatestTasks = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `select * from tasks where scheduled=false order by "Date" desc limit 10;`,
        [],
        (tx, res) => {
          let len = res.rows.length
          if (len > 0) {
            let results = []
            for (let i = 0; i < len; i++) {
              results.push(res.rows.item(i))
            }
            resolve({
              stat: true,
              res: results
            })
          } else {
            reject({ stat: false })
          }
        },
        err => {
          console.log(err)
          reject({ stat: false })
        }
      )
    })
  })
}

export const SelectTasks = (categoryId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `select * from tasks where categoryId = ? and scheduled=false order by id desc;`,
        [categoryId],
        (tx, res) => {
          let len = res.rows.length
          if (len > 0) {
            let result = []
            for (let i = 0; i < len; i++) {
              result.push(res.rows.item(i))
            }
            resolve(result)
          } else reject(false)
        },
        (err) => {
          console.log(err)
          reject(err)
        }
      )
    })
  })
}

export const SelectScheduledTasks = (categoryId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `select * from tasks where categoryId = ? and scheduled=true order by scheduled_datetime;`,
        [categoryId],
        (tx, res) => {
          let len = res.rows.length
          if (len > 0) {
            let result = []
            for (let i = 0; i < len; i++) {
              result.push(res.rows.item(i))
            }
            resolve(result)
          } else reject(false)
        },
        (err) => {
          console.log(err)
          reject(err)
        }
      )
    })
  })
}

export const removeTaskFromScheduled = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `update tasks set scheduled=false,scheduled_datetime=null where id=?`,
        [id],
        (tx, res) => {
          resolve(true)
        },
        err => {
          reject(err)
        }
      )
    })
  })
}

export const deleteTask = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `delete from tasks where id = ?;`,
        [id],
        (tx, res) => { resolve(true) },
        (err) => {
          console.log(err)
          reject(err)
        }
      )
    })
  })
}

export const deleteCategory = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `delete from categories where id = ?;`,
        [id],
        (tx, res) => {
          tx.executeSql(
            `delete from tasks where categoryId = ?`,
            [id],
            () => {
              resolve(true)
            },
            err => {
              console.log(err)
              reject(false)
            }
          )
        },
        err => {
          console.log(err)
          reject(false)
        }
      );
    })
  })
}

export const dropCategories = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `drop table categories`,
        [],
        (tx, res) => {
          resolve({
            stat: true
          })
        },
        err => {
          console.log(err)
          reject({ stat: false })
        }
      )
    })
  })
}

export const dropTasks = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `drop table tasks`,
        [],
        (tx, res) => {
          resolve({
            stat: true
          })
        },
        err => {
          console.log(err)
          reject({ stat: false })
        }
      )
    })
  })
}

