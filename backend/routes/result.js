const express = require('express');
const { AllResultList, addStudentResult, deleteStudentResult, updateStudentResult, searchStudentDetails } = require('../controllers/resultController');
const router = express.Router();

router.route('/').get(AllResultList)
router.route('/add').post(addStudentResult)
router.route('/update').put(updateStudentResult)
router.route('/delete/:Id').delete(deleteStudentResult)
router.route('/search/:Id').get(searchStudentDetails)

module.exports = router