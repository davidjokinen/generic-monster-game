var Shotgun = Gun.extend({
	init: function (PARENT){
		this.name = "Shotgun";
		this.PARENT = PARENT;
		
		this.title = "Shotgun";

		this.clipMax = 8;
		this.clip = 8;
		this.ammo = 64000;
		this.ammoMax = 64000;

		this.shots = 6;
		this.spread = 15;
		this.distance = 600;
		this.distanceSpread = 200;
		this.damage = 30;

		this.shotTime = 770;
		this.reloadTime = 3000;

		this.timer = 0;
		this.timerStart = 0;

		this.ID = -1;
		this.status = 0;
	}
});