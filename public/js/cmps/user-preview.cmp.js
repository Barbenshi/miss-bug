export default {
    emits:['deleted'],
    props: ['user'],
    template: `
    <div className="user">
        <button @click="$emit('deleted',user)">X</button>
        <h1>{{user.fullname}}</h1>
        <h2>{{user._id}}</h2>
    </div>
    `
}