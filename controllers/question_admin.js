import {
  getQuizById,
  getQuestionsByIdQuiz,
  updateQuiz,
  updateQuestion,
} from "../services/api.js";
var listQuestion = [];
var listAnswerSubmit = [];
const btnSubmit = document.getElementById("btn_submit");
var isSumit = false;

const app = {
  getQuizandQuestion: async function () {
    // 1. Lấy id trên url http://127.0.0.1:5501/question.html?id=abcd
    const searchParam = new URLSearchParams(window.location.search);

    // console.log(searchParam);
    if (searchParam.has("id")) {
      const id = searchParam.get("id");
      // console.log(id);
      // Phần 1: thông tin quiz
      // 2. Lấy dữ liệu Quiz theo id của quiz
      const dataQuiz = await getQuizById(id);
      console.log(dataQuiz);

      // console.log(dataQuiz);

      // 3. Hiển thị thông tin quiz qua giao diện
      this.renderQuizInfo(dataQuiz);

      // ===================================

      // Phần 2: Thông tin question:
      listQuestion = await getQuestionsByIdQuiz(id);
      this.renderListQuestion(listQuestion);
    }
  },
  renderQuizInfo: function (data) {
    var quiz_info = document.getElementById("quiz_info");
    quiz_info.innerHTML = `
    <form id="addForm">
        <h1>Thông tin Quiz:</h1>
        <div class="mb-3">
            <label for="title" class="form-label">Tên quiz</label>
            <h2><input type="text" class="form-control" value='${
              data.title
            }' id="title"></h2>
        </div>

        <div class="mb-3">
            <label for="title" class="form-label">Trạng thái</label>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" ${
                  data.isActive ? "checked" : ""
                } value="" id="isActive">
                <label class="form-check-label" for="isActive">
                    Kích hoạt
                </label>
            </div>
        </div>

        <div class="mb-3">
            <label for="time" class="form-label">Thời gian</label>
            <input type="number" class="form-control" value='${
              data.time
            }' id="time">
        </div>

        <div class="mb-3">
            <label for="description" class="form-label">Mô tả</label>
            <textarea class="form-control" id="description" rows="3">${
              data.description
            }</textarea>
        </div>
        
        
        <button type="submit" class="btn btn-primary">Update</button>
    </form>
    `;
    this.handleUpdate(data.id);
  },
  renderListQuestion: function (list) {
    // 1. tráo câu hỏi
    list = this.random(list);
    console.log(list);
    // 2. duyệt qua mảng câu hỏi
    const questionItem = list
      ?.map((item, index) => {
        // render các câu trả lời
        console.log(item.answers);
        const listAnswers = this.renderAnswers(
          item.answers,
          item.type,
          item.id,
          item.correctAnser
        );
        // console.log(listAnswers);
        // 3. Thay đổi nội dung câu hỏi
        return `
                <div class="question_item border border-2 rounded p-4 mb-2">
                <form class='form-ques'>
                <input type='text' value='${
                  item.id
                }' name='id' style='display:none'/>
                    <h4 class="question_number" id="${item.id}">Câu hỏi: ${
          index + 1
        }</h4>
                    <h5 class="question_title" >
                        <input name='name' style='width:800px' type='text' value='${
                          item.questionTiltle
                        }'/>  
                    </h5>
                    <div class="answer_items mt-3">
                       ${listAnswers}
                    </div>
                    Type:
                    <select name = 'type' >
                    <option ${
                      item.type == 1 ? "selected" : ""
                    } value = 1 > Single </option>
                    <option ${
                      item.type == 2 ? "selected" : ""
                    } value = 2 > Multi </option>
                    </select>
                    <button data-id='${
                      item.id
                    }' type="submit" class="btn btn-primary">Update</button>
                    </form>
                </div>
            `;
      })
      .join("");

    document.getElementById("question_container").innerHTML = questionItem;
    // xu li update question
    console.log(document.getElementsByTagName("form"));
    var form_ques = document.querySelectorAll(".form-ques");
    console.log(form_ques);

    form_ques.forEach((item) => {
      //=============================
      //   if (item.correctAnser.getAttribute("type") == "checkbox") {
      //     console.log("checkbox");
      //     var selectedAnswers = Array.from(item.correctAnser)
      //       .filter((item) => item.checked || item.selected)
      //       .map((item) => item.value);
      //     item.correctAnser.forEach((element) => {
      //       element.addEventListener("change", function () {
      //         // Nếu người dùng chọn checkbox
      //         if (this.checked) {
      //           // Thêm giá trị vào mảng nếu chưa có
      //           if (!selectedAnswers.includes(this.value)) {
      //             selectedAnswers.push(this.value);
      //           }
      //         } else {
      //           // Nếu người dùng bỏ chọn, loại bỏ giá trị khỏi mảng
      //           selectedAnswers = selectedAnswers.filter(
      //             (answer) => answer !== this.value
      //           );
      //         }
      //         console.log(selectedAnswers);
      //       });
      //     });
      //   } else {
      //     var selectedAnswers = [];
      //     item.correctAnser.forEach((element) => {
      //       element.addEventListener("change", function () {
      //         if (this.checked) {
      //           selectedAnswers[0] = this.value;
      //         }
      //         console.log(selectedAnswers);
      //       });
      //     });
      //   }
      //=======================
      //   item.correctAnser.forEach((element) => {
      //     if (element.getAttribute("type") == "radio") {
      //       var selectedAnswers = [];
      //       element.addEventListener("change", function () {
      //         if (this.checked) {
      //           selectedAnswers[0] = this.value;
      //         }
      //         console.log(selectedAnswers);
      //       });
      //     } else {
      //       var selectedAnswers = Array.from(item.correctAnser)
      //         .filter((item) => item.checked || item.selected)
      //         .map((item) => item.value);
      //       element.addEventListener("change", function () {
      //         // Nếu người dùng chọn checkbox
      //         if (this.checked) {
      //           // Thêm giá trị vào mảng nếu chưa có
      //           if (!selectedAnswers.includes(this.value)) {
      //             selectedAnswers.push(this.value);
      //           }
      //         } else {
      //           // Nếu người dùng bỏ chọn, loại bỏ giá trị khỏi mảng
      //           selectedAnswers = selectedAnswers.filter(
      //             (answer) => answer !== this.value
      //           );
      //         }
      //         console.log(selectedAnswers);
      //       });
      //     }
      //   });
      // Khai báo mảng selectedAnswers ngoài vòng lặp để không bị khởi tạo lại
      let selectedAnswers = Array.from(item.correctAnser)
        .filter((item) => item.checked || item.selected)
        .map((item) => item.value);

      item.correctAnser.forEach((element) => {
        if (element.getAttribute("type") === "radio") {
          // Xử lý radio button
          element.addEventListener("change", function () {
            if (this.checked) {
              // Radio chỉ lưu giá trị duy nhất
              selectedAnswers = [this.value];
            }
            console.log("Radio answers:", selectedAnswers);
          });
        } else {
          // Xử lý checkbox
          element.addEventListener("change", function () {
            if (this.checked) {
              // Nếu người dùng chọn checkbox, thêm giá trị vào mảng nếu chưa có
              if (!selectedAnswers.includes(this.value)) {
                selectedAnswers.push(this.value);
              }
            } else {
              // Nếu người dùng bỏ chọn checkbox, loại bỏ giá trị khỏi mảng
              selectedAnswers = selectedAnswers.filter(
                (answer) => answer !== this.value
              );
            }
            console.log("Checkbox answers:", selectedAnswers);
          });
        }
      });

      //=======================

      item.addEventListener("submit", (e) => {
        e.preventDefault();
        console.log("submit");
        // console.log("test:", selectedAnswers);
        // lay id cua question
        var id_ques = item.id.value;
        console.log(id_ques);
        this.handleUpdateQuestion(item, id_ques, selectedAnswers);
      });
    });
  },
  renderAnswers: function (listAnswers, type, idQuestion, correctAnser) {
    //listAnswers: danh sách câu trả lời
    // type: kiểu câu hỏi 1: radio, 2: checkbox
    //idQuestion: id của câu hỏi

    // 1. tráo câu trả lời
    console.log(listAnswers);
    listAnswers = this.random(listAnswers);

    // 2. duyệt qua mảng câu trả lời
    return listAnswers
      ?.map((ans, index) => {
        // tim kiem cau tra loi dung
        // console.log(ans);
        var check = false;
        correctAnser.forEach((item) => {
          if (item === ans.id) {
            // // In ra checked hoặc selected dựa trên type
            // const result =
            //   type === 1 ? "checked" : type === 2 ? "selected" : "";
            // console.log(result); // In ra checked hoặc selected
            // danh dau dap an dung
            check = true;
            return;
          }
        });

        return `
                <div class="form-check fs-5 mb-3">
                    <input ${
                      check ? "checked" : ""
                    } name='correctAnser' class="form-check-input border border-2 border-primary" role="button" 
                        type="${type == 1 ? "radio" : "checkbox"}" 
                        name="question_${idQuestion}" 
                        id="answer_${idQuestion}_${ans.id}"
                        data-idquestion="${idQuestion}"
                        data-idanswer="${ans.id}"
                        value='${ans.id}' >

                    <label class="form-check-label" role="button" for="answer_${idQuestion}_${
          ans.id
        }" >
                        <input name='answer' type='text' value='${
                          ans.answerTitle
                        }'/>
                    </label>
                </div>
            `;
      })
      .join("");
  },
  random: function (array) {
    console.log(array);
    return array.sort(() => {
      return Math.random() - Math.random();
    });
  },

  handleUpdate: function (id) {
    // 1 Bắt sự kiện submit
    const form = document
      .getElementById("addForm")
      .addEventListener("submit", async (e) => {
        // ngăn chặn hành vi load trang
        e.preventDefault();

        // 2. lấy input
        const inputTitle = document.getElementById("title");
        const inputIsActive = document.getElementById("isActive");
        const inputTime = document.getElementById("time");
        const inputDescription = document.getElementById("description");

        //3 . validate
        if (!inputTitle.value.trim()) {
          alert("Cần nhập thông tin tên quiz");
          inputTitle.focus();
          return; // ngăn chặn thực thi các tác vụ tiếp theo
        }

        if (!inputTime.value.trim()) {
          alert("Cần nhập thông tin thời gian");
          inputTime.focus();
          return; // ngăn chặn thực thi các tác vụ tiếp theo
        }

        // 4. lấy dữ liệu
        const data = {
          title: inputTitle.value,
          isActive: inputIsActive.checked,
          time: inputTime.value,
          description: inputDescription.value || "",
        };

        // 5. thêm mới db

        // console.log(data);

        const res = await updateQuiz(data, id);
        window.location = `question.html?id=${res.id}`;
        alert("Cap nhat thành công");
        console.log(res);
      });
  },

  handleUpdateQuestion: async function (form, id, selectedAnswers) {
    // lay input
    var name = form.name;
    var correctAnser = form.correctAnser;
    var answer = form.answer;
    var type = form.type;

    console.log(name, correctAnser, answer, type);

    // validate
    if (!name.value.trim()) {
      alert("ten cau hoi k dc trong");
      name.focus();
      return; // ngăn chặn thực thi các tác vụ tiếp theo
    }

    let isChecked = false;

    correctAnser.forEach((item) => {
      if (item.checked || item.selected) {
        isChecked = true; // Đánh dấu là đã có đáp án được chọn
      }
    });

    // Kiểm tra sau khi vòng lặp kết thúc
    if (!isChecked) {
      alert("Vui lòng chọn đáp án đúng");
    }
    // hoac sd doan ma sau
    // const isAnyChecked = correctAnser.some((item) => item.checked || item.selected);

    // if (!isAnyChecked) {
    //     alert("Vui lòng chọn đáp án đúng");
    // }

    answer.forEach((item) => {
      if (!item.value.trim()) {
        alert("dap an k dc trong");
        item.focus();
        return; // ngăn chặn thực thi các tác vụ tiếp theo
      }
    });

    // lay data
    let i = 1;

    // 1. Lấy id trên url http://127.0.0.1:5501/question.html?id=abcd
    const searchParam = new URLSearchParams(window.location.search);

    // console.log(searchParam);
    if (searchParam.has("id")) {
      var id_quiz = searchParam.get("id");
    }
    const data = {
      questionTiltle: name.value,
      correctAnser: selectedAnswers,
      answers: Array.from(answer).map((item) => ({
        id: `${i++}`,
        answerTitle: item.value,
      })),
      type: type.value,
      quizId: id_quiz,
    };
    console.log(data);

    //tien hanh cap nhat data
    const res = await updateQuestion(data, id);
    // window.location = `question.html?id=${res.id}`;
    location.reload();

    alert("Cap nhat thành công");
    console.log(res);
  },

  start: function () {
    this.getQuizandQuestion();
  },
};

app.start();
