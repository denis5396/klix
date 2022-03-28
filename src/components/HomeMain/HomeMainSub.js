import React from "react";
import { useEffect, useState } from "react/cjs/react.development";
import { db } from "../../firebase";
import s from "./HomeMainSub.module.css";
import { clrs } from "../ArticleLink/ArticleLink";
import { timeDifference } from "../AdminPanel/EditArticle/EditArticle";
import { getLen } from "../Article/Popular";
import { v1 as uuid } from "uuid";
import { subcategories } from "../AdminPanel/AddArticle";
import { Link } from "react-router-dom";
import { splitTitle } from "./HomeMain";

const getVisitShare = (mode, data) => {
  const dbRef2 = db.ref(`dates/2022/3/7`);
  return new Promise((resolve) => {
    dbRef2.once("value", (snap) => {
      const promises2 = [];
      let dataVisitPath = snap.val();
      for (let key in dataVisitPath) {
        promises2.push(
          fetch(
            `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/${dataVisitPath[key].path}/${dataVisitPath[key].id}.json`
          ).then((res) => res.json())
        );
      }
      const promisedData2 = Promise.all(promises2);
      promisedData2.then((data2) => {
        data2.sort((a, b) => {
          if (
            (a[mode].constructor === Object ? Object.keys(a[mode]).length : 0) -
              (b[mode].constructor === Object
                ? Object.keys(b[mode]).length
                : 0) >
            0
          ) {
            return -1;
          } else if (
            (a[mode].constructor === Object ? Object.keys(a[mode]).length : 0) -
              (b[mode].constructor === Object
                ? Object.keys(b[mode]).length
                : 0) <
            0
          ) {
            return 1;
          } else {
            return 0;
          }
        });
        data2.splice(15 - data.length);
        data = data.concat(data2);
        data.sort((a, b) => {
          if (Object.keys(a[mode]).length - Object.keys(b[mode]).length > 0) {
            return -1;
          } else if (
            Object.keys(a[mode]).length - Object.keys(b[mode]).length <
            0
          ) {
            return 1;
          } else {
            return 0;
          }
        });
        console.log(data);
        return resolve(data);
      });
    });
  });
};

const getPrevDateData = (data, route) => {
  return new Promise(async (resolve) => {
    console.log(data);
    const dbRef2 = db.ref(`dates/2022/3/7`);
    let dataVisit;
    let dataShares;
    const promises3 = [];
    let listOfUnder15 = "";
    if (data[1].length < 15) {
      dataVisit = getVisitShare("visited", data[1]);
      promises3.push(dataVisit);
      listOfUnder15 = "visited";
    }
    if (data[2].length < 15) {
      dataShares = getVisitShare("shares", data[2]);
      promises3.push(dataShares);
      listOfUnder15 = listOfUnder15.concat("shares");
    }

    if (route === "početna" && data[0].length < 15) {
      await dbRef2.once("value", (snap) => {
        const dataPaths2 = snap.val();
        let promises1 = [];
        const keys = Object.keys(dataPaths2).reverse();
        keys.splice(15 - data[0].length);
        console.log(keys);
        for (let i = 0; i < keys.length; i++) {
          promises1.push(
            fetch(
              `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/${
                dataPaths2[keys[i]].path
              }/${dataPaths2[keys[i]].id}.json`
            ).then((res) => res.json())
          );
        }
        promises3.unshift(...promises1);
        console.log(promises3);
      });
    }

    const promisedData2 = Promise.all(promises3);
    promisedData2.then((data2) => {
      console.log(data2);
      let final = [];
      if (
        (listOfUnder15.includes("visited") &&
          !listOfUnder15.includes("shares")) ||
        (!listOfUnder15.includes("visited") && listOfUnder15.includes("shares"))
      ) {
        final.push(...data2.slice(data2.length - 1));
        data2.splice(data2.length - 1);
      } else if (
        listOfUnder15.includes("visited") &&
        listOfUnder15.includes("shares")
      ) {
        final.push(...data2.slice(data2.length - 2, data.length - 1));
        final.push(...data2.slice(data2.length - 1));
        data2.splice(data2.length - 2);
      }
      console.log(data2);
      if (data[0].length < 15) {
        final.unshift([...data[0].concat(data2)]);
      } else {
        final.unshift(data[0]);
      }
      if (
        !listOfUnder15.includes("visited") &&
        listOfUnder15.includes("shares")
      ) {
        final.splice(1, 0, data[1]);
      } else if (
        listOfUnder15.includes("visited") &&
        !listOfUnder15.includes("shares")
      ) {
        final.push(data[2]);
      } else if (
        !listOfUnder15.includes("visited") &&
        !listOfUnder15.includes("shares")
      ) {
        final.push(data[1]);
        final.push(data[2]);
      }
      console.log(final);
      return resolve(final);
    });
  });
  //make below a func and reuse it for shares
  // const dataVisit = await getVisitShare("visited", data).then((data) => data);
  // console.log(dataVisit);
  // const dataShares = await getVisitShare("shares", data).then((data) => data);
  // console.log(dataShares);
  // dataVisit.forEach((it) => console.log(Object.keys(it.visited).length));
  // dataShares.forEach((it) => console.log(Object.keys(it.shares).length));
};

export const getSidebarData = (route) => {
  return new Promise(async (resolve) => {
    console.log(route);
    let finalData = [];
    const dbRef = db.ref(`dates/2022/3/8`);
    const promisesCat = [];
    let xd1 = [];
    console.log(subcategories["vijesti"]);
    if (route !== "Početna") {
      for (let i = 0; i < subcategories[route.toLowerCase()].length; i++) {
        ((incr) => {
          const dbRef2 = db
            .ref(
              `articles/${route}/${subcategories[route.toLowerCase()][incr]}`
            )
            .orderByKey()
            .limitToLast(15);

          xd1.push(dbRef2.once("value", (snap) => {}));
        })(i);
      }
    }

    // promisesCat.sort((a, b) => {
    //   if (new Date(a.date) - new Date(b.date) > 0) {
    //     return -1;
    //   } else if (new Date(a.date) - new Date(b.date) < 0) {
    //     return 1;
    //   } else {
    //     return 0;
    //   }
    // });
    // console.log(promisesCat);

    const dataPaths = dbRef.once("value", (snap) => {});

    console.log(dataPaths);
    console.log(xd1);
    let dataEdit = [];
    const promises = [];
    await dataPaths.then((data) => (dataEdit[0] = data.val()));
    if (Object.keys(dataEdit[0]).length) {
      for (let key in dataEdit[0]) {
        promises.push(
          fetch(
            `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/${dataEdit[0][key].path}/${dataEdit[0][key].id}.json`
          ).then((res) => res.json())
        );
      }
    }
    if (route === "Početna") {
      // const xy = Promise.all(dataPaths);
      await dataPaths.then((data) => (dataEdit = data.val()));
      dataEdit = await Promise.all(promises);
      console.log(dataEdit);
      // xy.then((data) => console.log(data));
    } else {
      const promisedData = await Promise.all([...promises, ...xd1]);
      // dataEdit.push(promisedData[0].val());
      dataEdit[0] = promisedData.slice(0, promises.length);
      promisedData.splice(0, promises.length);
      const acc = promisedData.reduce((acc, curr, i) => {
        let data = [];
        for (let key in curr.val()) {
          data.push(curr.val()[key]);
        }
        return [...acc, ...data];
      }, []);
      dataEdit.push([...acc]);
    }
    dataEdit.reverse();
    console.log(dataEdit);

    let buildingFinalData = [];
    if (route === "Početna") {
      buildingFinalData.push(dataEdit);
    } else if (route !== "Početna") {
      dataEdit[0].sort((a, b) => {
        if (new Date(a.date) - new Date(b.date) > 0) {
          return -1;
        } else if (new Date(a.date) - b.date < 0) {
          return 1;
        } else {
          return 0;
        }
      });
      if (dataEdit[0].length > 15) {
        dataEdit[0].splice(15);
      }
      buildingFinalData.push(dataEdit[0]);
      buildingFinalData.push(dataEdit[1]);
      console.log(buildingFinalData);
    }
    console.log(buildingFinalData);
    let dataJson = JSON.parse(
      JSON.stringify(route === "Početna" ? dataEdit : dataEdit[1])
    );
    let visitedDataSort = [];
    let sharedDataSort = [];
    //remove art with share equal to zero
    console.log(dataJson);
    dataJson.forEach((item) => {
      if (
        item.visited &&
        item.visited.constructor === Object &&
        Object.keys(item.visited).length >= 10
      ) {
        visitedDataSort.push(item);
      }
      if (
        item.shares.constructor === Object &&
        Object.keys(item.shares).length >= 10
      ) {
        sharedDataSort.push(item);
      }
    });

    visitedDataSort.sort((a, b) => {
      if (Object.keys(a.visited).length - Object.keys(b.visited).length > 0) {
        return -1;
      } else if (
        Object.keys(a.visited).length - Object.keys(b.visited).length <
        0
      ) {
        return 1;
      } else {
        return 0;
      }
    });

    sharedDataSort.sort((a, b) => {
      if (
        (a.shares.constructor === Object ? Object.keys(a.shares).length : 0) -
          (b.shares.constructor === Object ? Object.keys(b.shares).length : 0) >
        0
      ) {
        return -1;
      } else if (
        (a.shares.constructor === Object ? Object.keys(a.shares).length : 0) -
          (b.shares.constructor === Object ? Object.keys(b.shares).length : 0) <
        0
      ) {
        return 1;
      } else {
        return 0;
      }
    });
    if (route !== "Početna") {
      buildingFinalData.pop();
    }
    buildingFinalData.push(visitedDataSort);
    buildingFinalData.push(sharedDataSort);
    console.log(buildingFinalData);
    // buildingFinalData[0].splice(2);
    if (buildingFinalData[0].length > 15) {
      buildingFinalData[0].splice(15);
    }
    if (buildingFinalData[1].length > 15) {
      buildingFinalData[1].splice(15);
    }
    if (buildingFinalData[2].length > 15) {
      buildingFinalData[2].splice(15);
    }
    buildingFinalData[1].splice(2);
    if (
      buildingFinalData[0].length === 15 &&
      buildingFinalData[1].length === 15 &&
      buildingFinalData[2].length === 15
    ) {
      resolve(buildingFinalData);
    } else {
      const retData = await getPrevDateData(
        buildingFinalData,
        route === "Početna" ? "Početna" : "other"
      ).then((data) => data);
      console.log(retData);
      resolve(retData);
    }
  });
};

const HomeMainSub = ({ route }) => {
  const [sideBarData, setSidebarData] = useState([
    {
      first: [],
      second: [],
      third: [],
      current: "first",
    },
  ]);
  useEffect(async () => {
    let retData = getSidebarData(route);
    retData = await retData.then((data) => data);
    console.log(retData);
    setSidebarData([
      {
        first: [...retData[0]],
        second: [...retData[1]],
        third: [...retData[2]],
        current: "first",
      },
    ]);
  }, []);

  useEffect(() => {
    if (sideBarData[0].first.length) {
      console.log(sideBarData);
    }
    console.log(sideBarData);
  }, [sideBarData]);

  const handleFilterSidebar = (e) => {
    const { textContent } = e.target;
    switch (textContent) {
      case "Najnovije":
        setSidebarData((old) => [{ ...old[0], current: "first" }]);
        break;
      case "Najčitanije":
        setSidebarData((old) => [{ ...old[0], current: "second" }]);
        break;
      case "Preporuke":
        setSidebarData((old) => [{ ...old[0], current: "third" }]);
        break;
    }
  };

  return (
    <div id={s.sideBar}>
      <div id={s.sideBarControls}>
        <div
          className={`${s.sideBarControlItem}${
            sideBarData[0].current === "first" ? " " + s.itemActive : ""
          }`}
          onClick={handleFilterSidebar}
        >
          Najnovije
        </div>
        <div
          className={`${s.sideBarControlItem}${
            sideBarData[0].current === "second" ? " " + s.itemActive : ""
          }`}
          onClick={handleFilterSidebar}
        >
          Najčitanije
        </div>
        <div
          className={`${s.sideBarControlItem}${
            sideBarData[0].current === "third" ? " " + s.itemActive : ""
          }`}
          onClick={handleFilterSidebar}
        >
          Preporuke
        </div>
      </div>
      <div id={s.sideBarContent}>
        {sideBarData[0][sideBarData[0].current].length
          ? sideBarData[0][sideBarData[0].current].map((item) => (
              <div className={s.sideBarItem} key={uuid()}>
                <h3 style={{ color: `${clrs[item.category.toLowerCase()]}` }}>
                  {item.subTitle}
                </h3>
                <p>
                  <Link
                    to={{
                      pathname: encodeURI(
                        `/${item.category}/${item.subCategory}/${splitTitle(
                          item.title
                        )}/${item.id}`
                      ),
                      state: { articleData: item },
                    }}
                  >
                    {item.title}
                  </Link>
                </p>
                <div className={s.sideBarItemBundle}>
                  <span>{timeDifference(item.date)}</span>
                  <div className={s.sideBarItemBundleRight}>
                    <span>
                      <i class="fas fa-comments"></i>
                      {getLen(item)}
                    </span>
                    <span>
                      <i class="fas fa-share-alt"></i>{" "}
                      {item.shares.constructor === Object
                        ? Object.keys(item.shares).length
                        : 0}
                    </span>
                  </div>
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

export default HomeMainSub;
