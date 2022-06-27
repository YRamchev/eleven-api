const Product = require('../models/Product')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')

const getAllProducts = async (req, res) => {
  const products = await Product.find({})

  res.status(StatusCodes.OK).json({ products })
}

const getSingleProduct = async (req, res) => {
  const { id } = req.params
  const product = await Product.find({ _id: id })

  if (!id) {
    throw new CustomError.NotFoundError(`Product with ${id} not found!`)
  }
  res.send(StatusCodes.OK).json({ product })
}

const createProduct = async (req, res) => {
  const { name, size, weight } = req.body

  if (!name || !size || weight) {
    throw new CustomError.BadRequestError("Please provide values!")
  }

  const product = await Product.create({ name, size, weight })
  res.status(StatusCodes.CREATED).json({ product })
}

const updateProduct = async (req, res) => {
  const { name, size, weight } = req.body
  if (!name || !size || !weight) {
    throw new CustomError.BadRequestError(
      'Please provide email and name values!'
    )
  }

  const product = await Product.findOneAndUpdate(
    { _id: req.params.id },
    { name, size, weight },
    { new: true, runValidators: true }
  )

  res.status(StatusCodes.OK).json({ product })
}

const deleteProduct = async (req, res) => {
  const { id } = req.params

  const product = await Product.findOneAndDelete({ _id: id })

  if (!product) {
    throw new CustomError.NotFoundError(`Product with ${id} not found!`)
  }

  res.status(StatusCodes.OK).json({ product })
}

const uploadImage = (req, res) => {
  res.send("delete product")
}

module.exports = { getAllProducts, getSingleProduct, createProduct, updateProduct, deleteProduct, uploadImage }