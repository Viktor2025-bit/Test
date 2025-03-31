const axios = require("axios")

exports.getQuestions = async (req, res) => {
  try {
    const { amount = 20, difficulty = "hard", type = "multiple" } = req.query

    const apiUrl = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=${type}`

    const response = await axios.get(apiUrl)
    if(response.data.response_code!==0){
        return res.status(400).json({ Msg : "Failed to fetch questions" })
    }

    res.status(200).json({ Msg : "Questions fetched successfully", testId: test._id,
      questions: questions.map((q) => ({ text: q.text, options: q.options })), questions : response.data.results, starTime : new Date()})
  } catch (error) {
    res.status(500).json({ Msg : error.message })
  }
}

