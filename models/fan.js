class Fan(object):

    def __init__(self):
        logger.info("Creating fan")
        self.state = OFF
        self.prev_fan_millis = 0  # last time vent state updated
        self.fan_on_delta = cfg.getItemValueFromConfig('fan_on_t')  # vent on time
        self.fan_off_delta = cfg.getItemValueFromConfig('fan_off_t')  # vent off time

    def control(self, current_millis):
        logger.info('==fan ctl==')
        # if fan off, we must wait for the interval to expire before turning it on
        logger.info('==current millis: %s' % (current_millis))
        logger.info('==current fan state: %s' % (self.state))
        if self.state == OFF:
            # if time is up, so change the state to ON
            if current_millis - self.prev_fan_millis >= self.fan_off_delta:
                self.state = ON
                logger.info("..FAN ON")
                self.prev_fan_millis = current_millis
        # else if fanState is ON
        else:
            # time is up, so change the state to LOW
            if (current_millis - self.prev_fan_millis) >= self.fan_on_delta:
                self.state = OFF
                logger.info("..FAN OFF")
                self.prev_fan_millis = current_millis
        #self.state = ON
        return
        