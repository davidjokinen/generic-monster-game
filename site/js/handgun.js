var Handgun = Gun.extend({
	init: function (PARENT){
		this.name = "Handgun";
		this.PARENT = PARENT;
		
		this.title = "Handgun";

		this.clipMax = 7;
		this.clip = 7;
		this.ammo = 64000;
		this.ammoMax = 64;

		this.shots = 1;
		this.spread = 4;
		this.distance = 2000;
		this.distanceSpread = 100;
		this.damage = 70;

		this.shotTime = 300;
		this.reloadTime = 2000;

		this.timer = 0;
		this.timerStart = 0;

		this.ID = -1;
		this.status = 0;
	}
});