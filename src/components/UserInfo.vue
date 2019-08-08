<!-- userInfo -->
<template>
  <div class="user-info">
    <Dropdown @on-click="dropDownHandle">
      <img class="avator" :src="avatorUrl" onError="this.src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAABYCAYAAABxlTA0AAAAAXNSR0IArs4c6QAAErtJREFUeAHtXWtsHNUVPrPvtXdtJ05C7Lix86qBEFJCSMIjMQRoebRSoRTKI5RCoYXSglALEgVBBaKlP5BataWiompBFS0F8astaihgHkkch0AIAVICsYNfJHHieDf2vqfnm/XM3pmdfczuzDqpuNJqzn3Mued+e/Y+zr33rETHSJBl2fXalv5OySV3yhlXpyzJnRLJi0mmJlmSwixmmON4cpIU4UdEkuUISTTG8T2SLO2WXJndckbavW5N+25JkjIoO91Bmk4B3tjavzQj0/qMLK+XZOqSSZ5hhzwSSYdlibpdkvSyS6KXz1nVvssOvpXwqDnAb27btyiVTG8gSdrAWruwEqGtvsPa/AnJ8tMer/vps1fO/9jq+9WUrwnADKT79Z59V/PzVtbSs6oRuNp3Wbs3MeCPr109/xl+pqvlV+p9RwHetUv2HYzsu4F7zXvK0lZJGp2Mu/oORX3Rz8b8NHjAHzoy4QnHElJdPOmuS6SkEBrk88hRvzc9EfDJE411qci82fHoCU1xmhlKhIL+TAdra3PJhkOrSXp0Vnj+n5YulRKlylea7xjA3T3918sZ+REGd14h4VibJiOT7p0fD9dP7uyvbxk+5FvCZauVSW6ZmfhoWfvR4UUtR4PhYHoZ/2qChWTg6gYll3Rv1+r2pwqXqTyn2sbk1fxm775TUun072SZ1uZlcgL/LOVYzL3jrb0Nkd7/NixPJKnBrJxdaT4vjZ/xxfEdpy8YDwcC6eX8SzJtsyTR6x63+7azz5j/nl11g49pZZVUsG2b7J1I9j2cIeku1lpPPg8pPnTI3/OvbbM7DkXc8/PznU+ZGU7vu3jlgb7WmfHVLKM/v0Yp5SL5sTpvx30rV0rJ/HzrKbYA3N3Tt4Ay8t9kojOMIqAb6N8f2Pqv7bM7x4+65hrzpyPeUJ8ZuXjFgd3tc2KrzLoPBqWXXNJVXas79lYrX9UAv9rTdxnP/P/IA0uTUZjopGfrX1+b23o46mkz5h0L8Rmh1MC31o0MhYKpVXnySNIY/75vPHd1xwt5eRYSqgK4e3PffawBDxnr40XZ4MbtswZ29NXxT/HYD8s7JnouPP1AG68U8wZk/gXe33Vmx8OVtqIigHmgwLL2Vwzu7caKj0z6tjy1ce5JsaSr0Zh3LMcD3syR6y8c+aAxmFhjlJNB/g0vv+/gAdry8tsywMrcdrzvae5vrxQF4VE48dbHTZv/83ZTl5h+vNHnnzbWffqisTN5FuQTZWegnp3V0LHB6pzZEsBZze17xgguydLh5zadMLB3JLBMFOp4pRfMje284qzP2kjS20YA8ro1HVdb0WRLAHdv6fsNg/wDETieVg4//XLr0c/GvIvF9OOdPqEpuWfD+qF6nra3iG1Bd8F98g/FtGJ02QCbDWgZ2fXJH16cFxifcLcWq+R4zWuoSw/dfNFgzCVldEYpKwNfWQAzuJfzgPa8CBQ094kX22SnwPW4iU5dRLR6KdEXTiBq5vXezKk136FxolH+fPoZUQ8bIt9l+1jKIbMNQL7logEsQHWazPPky8uZwpUEGIsI7vC36+a53Oc+9XLrqBPdQhOb1K++gOi8FUR1AfErLUxPxIhe2U70zEtEYzDF2xzQXVy/fqhZ1yfzPJkH9hWlFiNFAcby92iy700e1LQVGmYLf39j7m67BzRo7FXnE13Gc5CAbvwuH60Y28Re6Cb623/s12gMfN88Z6RTnF0weL313o6ziy2rXcXEh21BBBdlMRWzG1xo7S9uZc29sHJwIRu+GPAAL/C0M6DNaLvIE9gAIzHNSBfUYFjFkqnM26LhBouIJ/7ZmjcRNzK1Eu/gnu3BG4lm5S20rXDJL3twjOiBJ4n6R/Lzqkm55ZKhLfrFiJTyelynFbLCFdRgmBxFcLH8xQqtGuGM70LLnAAX9eAL+9lN9msyMOBN1sFcW2RPFqtcikiZAqwYyw32XNgW7Fz+os+979v2a67YOICMOlCXXQEYbHxr9oDID7ZvYCamqXQewFgKZ3ci1CJEsIrZbbjBgHZie64OpyjUgbrsDMACmIg8gRmwE9NA5wE8tYemWZV4Uj0Jk6PxxWri6BowW6hVQF12D3rABNjk2iDPy2KXSwGlA5iXwfxjku8Ri+w7WNdjtz0X89xKp2KibOXSyuyC67QzABNsJOh5Kpu7ug5JB/DU1vrC3EtS/J/bmk/Mxaun0B9iEVHrgDrt7IshP3ZpeNctrraFFXQhMFTjeOoA5gI8g8wF7KHZvc2D5W+5K7ScJNVTqBN12xmADTASeRox1ADGiRu2N5ylFsbiGxuUatyuJ2wL0xWcqBsYASu1TcAQWKpxDeB0Kq2bZmBr3YndXxhupis4UTcwAlZim5SjYVMJGsA8eb5OLIRzC2LcLhpWsekKTtWdhxWfu1PbqACMZTE6aDUR0w8cClHjdj5Vk6OdPMvl5VTdwEqcsgFLYAq5FIDTGfk8UUgcZ3L6xI1YX61oXnE5EoAVMBOZq5gqAON8rpiJs2Ji3E4axvLpCocd6fSyrTFipmLqYnV24fCz2GgcxBPjdtLYiZiu4GTdRsyUA+WMrXJsn6cWuZPlfIR06pSjIzhgm2e6gpN1K5gxdmrbgCmuRLhwJ0JNxBPnc/lR0E6MMtUE7KFNV3C4bmkKO615wNYl84UTLYWJg+O+qBi3m8YGJfbQah1QJ+p2MuDguMgf2Lpwm0dMHOGT5U4G7P5ig7LWAXU6tfOstoWXzSqpPIEtX8Lhq1JCGB7127ybJTCfIrH7iw3KWgXUhTqdDkMG7IAtzyKk3ADHEoxPeJR7EE4Kg6117P7WKqAuJ7bzjfJHjNjxHT8XD2c6QHHhxPiiE3FsrX/Y7wRnPU/UgbpqEYzY4QIlFhq6LgG3eWohDPrDh//Mgyrv/joVwBt1ON33qvKbYBdGH6wDWL0qpb7k5BM/2wf/SOTECgs8H3iyNl2DipERO2CrLJXVArV+XrxGpns3pMjjSrCWWT7bXFBc8ALPn16fItQxncGTvVidu7iHS36ptDTTSaHQ6CvXp8jvzYIKI8zEZJL8Pjf5vG5c9aqoel72UyKZpniC+x8OoWCaNnwlzXW56LlXPPSPzZXxLVcYYMdlNeyALTRYZwLBDcpyGVotN4M7o59cQ3TjV9MauCIPABOdSCggAaxygwos3lXBFd/FF3ntlxP027tS1D5XzLGXNsEu4oFLALEpuJ5qb7VZbqfzcubua4nqg0RJvo2WZE0zC8A1Fk/xh8jtlsjLO5V8a54kVgU8EdhSRTIrP55JHsHSabEFZlyzaTPCafr59zL0fLeHnn/V/t7RiB2w9fA0bYyvYWkhXJeKDh/yanE7iMvWEX3nUgZoqk18lotiDFYpLQVw6XRKEwHddDIpU8BfzU9dpm90pWjxPDc9+hfe4rYx4N60jh1j6+J+Yo+Y2Noc1xcSMy3S2Ca/8yqim76WA1dl4WGQrYT9h1P00pYJ2tgzQds+iFEm231bYSGUlWn54hT9+s6UreczcCldqASOQ/awLVjaLSbyNVMxWjHdUE/08+8TXbDSnAW0uNwAcHt3xSmRyv7Uhg+kqfd9Bln45ZXLSyw3qzFNv/9xklpni6mV07jxLwZgy+bKjA5guAQQC1VCQ3Pvv4HopI7Cb3vcLu5jS4OMbuHtDxJ5Grv/UJr2DlZ/ndjHA+AjNydt0WQjdsCWzZV6DVb8LfD5qcLQlM65/Yri4Koc/DwlKxXQ56qaayx7dLIqMTV2APmXt+X6ei3DGiFPYae9BWxdigMh9nGTS5Wb4W9Bi1skMKAV6haMrNAPu9WRz5g5FceA1jI7/4uA8re3eAq8ZT0Z3cU915rPbMrhpmAmOALhec9hYMszHykDB0IiEzizEOPl0piKYbZgJQT8pUFa0RmgOTNzIAPcVacEqDFUuouxIsvyxWn6xrmVjZ5GzIApsFUkhHcmURB4ChHj5dBYRGCeW0Ih81ipc928DCEBPM9YGqCTF/pYa7109peCfII9B7hQtEoyO4WrZDFixEzFVAHY7ZJeESWDGxZ4ChHTStHf5akYFhGVBGhxqeUxW6VoUZuXTl3is11z9TLLdPc11vpjYAXMRD5wJ4a4AjAucHADP1EL8DopCDcsarzUc9lCoq7TSpUqnI8FWjBQvKvY/G6MNu3IfRIJewY4M6mw4rv0zPL5AytgpvIClqqvNgVgJYP9iqkF8ISPGzFejL7uomK55eVh2uZjY0+hcHAsTaNHcp+kNSUrxLZg+hXnlV9BHlYClhrAcNom1gYHQvBxI6aZ0aew9i5dYJZjPS3g8/AhaU0kjYGZJTNZpv1BY2KRgIHokjK0GBgBK5G9iKXWGnjE46nFJrUg2wkkOBBS44Wel3cVyqksvS7ozVuAZEzATJmkVVZj4be+vrb0tA0YASuVCzAUvQtqAKMA9x2PqwXxhHcmOBAS00S6kZfDmJrZHeoCXp6NaDKTmQbXYhsoFMxQW5FlNLDJerDKIWDEUAfwlLtBbbDjBZ0f3plyr+upc1fApKhPsyOGQa8+6NM02Qzgck2U1ckj89XcwlqcxSbnHgyDGzAU69QBzAWYm/SoWACur+CdSUxT6TNPUSn7n1mQvUqfzEdB8ypIThl+8jJsTji5PWPKEZgAG32m9GgWw1yqDmAkw5cjg6xdFcX0A66vcq9kKT+bjDvnG1Ptj6NPdpmsXmrRRaA1fp9MYZN9dmAiTs2AWRY7PQZ5AMPpD3w5isXgVwyur8S0k3nm4C0+dRWLV0W7Tfqh2nQREFtm24r+FwQsjL7WgJmZw6Q8gMESjjL5J/o6aDVcuOJgG1xfqfHF81TK+acZmE5P08RWLV2Q6yaAAXysifnAqpBzUVOA8TIcZbLaa7NttlvMg18xlfG8OSrl/DNtMs6kM7lZhtMSzJmR02BgwJtdgnpJqSxW5lIUBBjLZzjKFF+DnwT4FUNasemL+I4dtNkgx18+X2jMnzPbUZ+RR2N9FmC0Xe8rArYG+bFCviLApyDAyGxu6Lif9aQXtBrgtA3uVWA9q1UwW1Sk+LcFe3I9D4IYCL1VnKco1Q6PWya0GW0XywIbeGoV04x0UYCVTpu9kPIKRDtBxjvlPjht46upe4zMnIqbzYPFaRqW10G2yIXrfWw0yoItLlQqlQs88MW5JM8etBlt13gBE8ammL8elC0KMAooXpXYCyloLbBHvPd3D9TzEjFv+qaVsZEwG+TMtBpVYjMVYIfqfMoHgPvZxoHzFdgDBGhsq1XMozxnVWikIQ9lUBbvqO8HfO6h9z8aqtd5nEJFjEkpj1MoVhJgFIJ/MBbpftBq4MMhLdvfG4nVAmQzgEUNVmUyPhUNZMBxJAvmUHQnCnCs6dB2fEL48JeBPJRBWXxJeBdtQxvRVpE3sCjHZxreKQtgFISLV/7GfwtaDdGj8YVb3xnkAyzOdhelughVHjufaBPahjaKfBlcuFZ8WEwrRpcNMJisW93+I+7YnxUZ4tvd/NanzalUZqeYbidt1h2kHFwqoy1oU77mwjlo+x1W2mYJYNbgDFy8GkHm82EzNm/f13kkEu+2Unm5Zc00GFM3ExNFuSwLlkMb0Ba0SSyENittZwzE9FK05cUuZhbcN13Nl+z281r8drUCPsrke2fXcFfr3IYti9tnnMRfRqOaV+3TrA8GT/TDfi833YbAbTqyp//wB0Mj411GdugWoLlQMGNeqbglDVaZoSK4eDUOfMhnAdf07hiKJhJpne1CfbeSZyGA7eomIGvvjsEoZDfKhzYqba0AXPCq+usv5iS/ZU5o65IFza38hbQZBbcSf3VblAb359/7unRtI3uTqtwgzVo78NHe0aHh/VGD2RHI2OMkvyINFsFRpnDshZS/Kd2KD2Ug+Ju9nzaPHIi+ytGCOyMoW0ngkb7SMAKZIJsZuGgLT5FXlDsVKyZE1RqsModTttHxvocK/VEJm/PiC9qaetpaGjtYeEuW5MhEhv69aZwvL+a6wJMWBmnFidpOuSpG0Sd/IfsGho/07R0YW82O5Pz5hY/RPyoRBS3nr3aam4I72ttmREL1XuzGluVk5uAYnw/uiSin2ee3+GjtaWUfAh2PHk3u6B84HB4dmzx+/2pHBBl0OX8WxQf/JufMqts5pzk02RD2t/DqaQm/WvBX9elIkj7si9H5q8K80jLWqMXlTEb+aDwSH94/Gg3uPzixLJ3JFFH14+zPorRmMqH8JYSFvzvjG0ajTY2BvnAoEA2H2HDj94Z52cqqKtfxQImNG1VtozxA8V0SaYJd8EYn48lIJJqgSDQWGjsS6+CbRs2iHGY08/uE3z9+/+5MbBSD8fkf9omAOEl//peTTqJr4I0BEd6Z4EBI8XEjurYxlLUS5cWB9qepODlabMfBCt9KyhYcUCphVs073I38X/7t7/8AJi+jGh5WEJ8AAAAASUVORK5CYII='" />
      <div class="user-name">{{userName}}</div>
      <DropdownMenu slot="list">
          <DropdownItem name="goPersonal">个人中心</DropdownItem>
          <DropdownItem name="logOut">退出</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
  export default {
    name: 'userInfo',
    props:['avatorUrl', 'userName'],
    data() {
      return {

      };
    },
    components: {},
    
    created() {},
    
    mounted() {
      // this.getLanglist()
    },

    methods: {
      dropDownHandle (name) {
        switch (name) {
          case 'goPersonal':
            this.$emit('goPersonal');
            break; 
          case 'logOut':
            this.$emit('logOut');
            break;
        }
      }
    },
    
    computed: {},

    watch: {}
  };

</script>
<style lang='less' scoped>
  .user-info {
    height: 100%;
    cursor: pointer;
    .avator {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      margin: 0 10px;
    }
    .user-name {
      // color: #fff;
    }
    .ivu-dropdown {
      height: 100%;
      /deep/.ivu-dropdown-rel {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
      }
      .ivu-dropdown-item {
        text-align: center;
        &:hover {
          background-color: #4B74FF;
          color: #fff;
        }
      }
    }
  }
</style>
