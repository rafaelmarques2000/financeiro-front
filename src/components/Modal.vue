<template>
    <div class="backdrop" @click.self="closeModal('backdrop')">
        <div class="comp-modal" :style="`width:${props.width};`">
           <div class="comp-modal-title">
               <h1>{{props.modalTitle}}</h1>
               <a href="" @click.prevent="closeModal('title-close-button')" class="comp-close-button">X</a>
           </div>

          <div class="comp-modal-body">
              <slot></slot>
          </div>
        </div>
    </div>
</template>

<script>
export default {
  name: "Modal",
  props:{
    modalTitle: {
       type: String,
       required: true
    },
    closeInBackdrop:  {
      type: Boolean,
      required:false
    },
    width:{
      type:String,
      required:true
    }
  },
  emits:["close-modal"],
  setup(props, ctx) {
    const closeModal = (eventSource) => {
        if(eventSource === "backdrop" && props.closeInBackdrop) {
            ctx.emit("close-modal")
            return;
        }

        if(eventSource === "title-close-button") {
          ctx.emit("close-modal")
        }
    }
    return {
      props,
      closeModal
    }
  }
}
</script>

<style scoped>
    .backdrop {
        position: absolute;
        box-sizing: border-box;
        padding-top: 30px;
        background: rgba(0 ,0 ,0 ,0.7);
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        overflow: auto;
    }

    .comp-modal {
        margin: 0 auto;
        background: #FFF;
        height: auto;
    }

    .comp-modal-title {
      padding: 20px;
      margin-bottom: 15px;
      border-bottom: solid 1px #ccc;
      font-weight: bold;
      font-family: 'Roboto', sans-serif;
      font-size: 1.4em;
      display: flex;
      width: 100%;
    }

    .comp-modal-title h1 {
      width: 100%;
    }

    .comp-close-button {
       text-decoration: none;
       color: #888;
       display: block;
       box-sizing: border-box;
       padding: 3px;
       border-radius: 5px;
    }

    .comp-close-button:hover {
        background: #CED4DA;
    }

    .comp-modal-body {
       padding: 20px;
    }
</style>