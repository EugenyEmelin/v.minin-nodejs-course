const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    email: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                courseId: {
                    type: Schema.Types.ObjectId,
                    required: true,
                    ref: 'Course'
                }
            }
        ]
    }
})

userSchema.methods.addToCart = function(course) {
    const items = [...this.cart.items]
    // console.log(items, 'items', course, 'course')
    const idx = items.findIndex(item => {
        return item.courseId.toString() === course._id.toString()

    })

    console.log(idx, 'idx')
    if (idx >= 0) {
        items[idx].count = items[idx].count + 1
        console.log("повтор")
    } else {
        items.push({
            courseId: course._id,
            count: 1
        })
    }

    this.cart = {items}
    return this.save()
}

module.exports = model('User', userSchema)