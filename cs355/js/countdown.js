const countdown = function(callback, end, update_interval, data){
    let inteval_id;
    let remaining;
    let start = function () {
        let remaining = end - new Date();
        let inteval_id = setInterval(function (){
            remaining = end - new Date();
            callback({remaining: parseInt(remaining/1000), data});
            if(remaining <= 0){
                stop();
            }
        },update_interval);
        callback({remaining: parseInt(remaining/1000), data});
    };
    let stop = function () {
        clearInterval(inteval_id);
    };
    return Object.freeze({start, stop});
};

const update_dom = function (spec){
    let {remaining, data} = spec;
    remaining_time_node = data;
    let days = parseInt(remaining / (24*60*60), 10);
    let hours = parseInt((remaining - (days * 24*60*60)) / (60*60), 10);
    let minutes = parseInt(((remaining - (days*24*60*60 + hours*60*60)) / 60), 10);
    let seconds = parseInt(remaining % 60, 10);
    
    hours   = `${hours}`.padStart(2, '0');
    minutes = `${minutes}`.padStart(2, '0');
    seconds = `${seconds}`.padStart(2, '0');
    
    if(remaining <= 0){
        remaining_time_node.textContent = "Closed";
    }
    else{
        if(days < 1){
            remaining_time_node.innerHTML = `Submissions Close In: <span class="countdown-timer urgent">${hours}:${minutes}:${seconds}</span>`;
        }else{
            remaining_time_node.innerHTML = `Submissions Close In: <span class="countdown-timer">${days}:${hours}:${minutes}:${seconds}</span>`;
        }
    }
}

const countdown_nodes = Array.from(document.getElementsByClassName('countdown'));
countdown_nodes.map(function(countdown_node){
    let end_datetime_node = countdown_node.getElementsByClassName('end-time')[0];
    let remaining_time_node = countdown_node.getElementsByClassName('remaining-time')[0];
    const end_datetime_string = end_datetime_node.dateTime;
    const end_time = new Date(end_datetime_string);
    let counter = countdown(update_dom, end_time, 1000, remaining_time_node);
    counter.start();
});

