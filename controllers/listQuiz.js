import {
  getAllQuiz,
  getQuizById,
  getQuestionsByIdQuiz,
  deleteQuizById,
  deleteQuestionByQuizId,
} from "../services/api.js";

const app = {
  renderListQuiz: async function () {
    // 1. lấy danh sách quiz
    const data = await getAllQuiz();
    console.log(data);
    // 2. duyệt mảng data và hiển ra tr
    document.querySelector("tbody").innerHTML = data
      .map((item, index) => {
        return `
                <tr>
                    <th scope="row">${index + 1}</th>
                    <td>${item.title}</td>
                    <td>${
                      item.isActive
                        ? `<span class="badge text-bg-success">Kích hoạt</span>`
                        : `<span class="badge text-bg-danger">Chưa kích hoạt</span>`
                    }</td>
                    <td>${item.time}</td>
                    <td>${item.description}</td>
                    <td><button data-id='${
                      item.id
                    }' type="button" class="btn-detail btn btn-warning">Detailt</button></td>
                    <td><button data-id='${
                      item.id
                    }' type="button" class="btn-delete btn btn-danger">Xoa</button></td>
                </tr>
            `;
      })
      .join("");

    var remove = document.querySelectorAll(".btn-delete");
    remove.forEach((item) => {
      item.addEventListener("click", async () => {
        // lay ra data-id
        var id = item.getAttribute("data-id");
        if (window.confirm("ban co chac muon xoa quiz nay?")) {
          // delete list question
          var listQuestion = await getQuestionsByIdQuiz(id);
          console.log(listQuestion);
          listQuestion.forEach(async (item) => {
            await deleteQuestionByQuizId(item.id);
          });
          await deleteQuizById(id);
          alert("Xoa thanh cong");
        }
      });
    });

    var detail = document.querySelectorAll(".btn-detail");
    // gan su kien click
    detail.forEach((item) => {
      item.addEventListener("click", async () => {
        // lay ra data-id
        var id = item.getAttribute("data-id");
        window.location = `question.html?id=${id}`;
        // // Lấy dữ liệu Quiz theo id của quiz
        // const dataQuiz = await getQuizById(id);
        // console.log(dataQuiz);
        // // chuyen sang trang chi tiet quiz
        // this.renderDetailtQuiz(dataQuiz, id);
      });
    });
  },

  //   renderDetailtQuiz: async function (dataQuiz, id) {
  //     // them thong tin quiz
  //     var content = document.getElementById("content");
  //     content.innerHTML = `
  //     <div class="d-flex justify-content-between sticky-top bg-danger-subtle px-3">
  //         <div id="quiz_info">
  //             <h1>Thông tin Quiz:</h1>
  //             <h2 id="quiz_heading">${dataQuiz.title}</h2>
  //             <h6 id="quiz_description">${dataQuiz.description}</h6>
  //         </div>
  //     </div>
  //     `;
  //     // Thông tin question:
  //     var listQuestion = await getQuestionsByIdQuiz(id);
  //     console.log(listQuestion);
  //     this.renderListQuestion(listQuestion);
  //   },

  //   renderListQuestion: function (list) {
  //     // 1. tráo câu hỏi
  //     list = this.random(list);
  //     // 2. duyệt qua mảng câu hỏi
  //     const questionItem = list
  //       ?.map((item, index) => {
  //         // render các câu trả lời
  //         const listAnswers = this.renderAnswers(
  //           item.answers,
  //           item.type,
  //           item.id
  //         );
  //         // console.log(listAnswers);
  //         // 3. Thay đổi nội dung câu hỏi
  //         return `
  //             <div class="question_item border border-2 rounded p-4 mb-2">
  //                 <h4 class="question_number" id="${item.id}">Câu hỏi: ${
  //           index + 1
  //         }</h4>
  //                 <h5 class="question_title" >
  //                    ${item.questionTiltle}
  //                 </h5>
  //                 <div class="answer_items mt-3">
  //                    ${listAnswers}
  //                 </div>
  //             </div>
  //         `;
  //       })
  //       .join("");
  //     const question_container = document.createElement("div");
  //     // question_container.classList.add("question_container");
  //     question_container.id = "question_container";
  //     var content = document.getElementById("content");
  //     content.appendChild(question_container);
  //     document.getElementById("question_container").innerHTML = questionItem;
  //   },

  //   renderAnswers: function (listAnswers, type, idQuestion) {
  //     //listAnswers: danh sách câu trả lời
  //     // type: kiểu câu hỏi 1: radio, 2: checkbox
  //     //idQuestion: id của câu hỏi

  //     // 1. tráo câu trả lời
  //     listAnswers = this.random(listAnswers);
  //     // 2. duyệt qua mảng câu trả lời
  //     return listAnswers
  //       ?.map((ans, index) => {
  //         return `
  //             <div class="form-check fs-5 mb-3">
  //                 <input class="form-check-input border border-2 border-primary" role="button"
  //                     type="${type == 1 ? "radio" : "checkbox"}"
  //                     name="question_${idQuestion}"
  //                     id="answer_${idQuestion}_${ans.id}"
  //                     data-idquestion="${idQuestion}"
  //                     data-idanswer="${ans.id}" >

  //                 <label class="form-check-label" role="button" for="answer_${idQuestion}_${
  //           ans.id
  //         }" >
  //                     ${ans.answerTitle}
  //                 </label>
  //             </div>
  //         `;
  //       })
  //       .join("");
  //   },

  //   random: function (array) {
  //     return array.sort(() => {
  //       return Math.random() - Math.random();
  //     });
  //   },
  start: function () {
    this.renderListQuiz();
  },
};

app.start();
