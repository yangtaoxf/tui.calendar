'use strict';

var domutil = require('common/domutil');
var Collection = require('common/collection');
var TimeClick = require('handler/time/click');

describe('handler:TimeClick', function() {
    var mockInst, mockCollection;

    beforeEach(function() {
        // 컨트롤러에 id '2'인 객체가 있다고 가정
        mockCollection = new Collection();
        mockCollection.add({
            _id: '2',
            text: 'hello'
        });

        mockInst = jasmine.createSpyObj('TimeClick', ['checkExpectCondition', 'fire']);
        mockInst.baseController = {
            schedules: mockCollection
        };
        mockInst.checkExpectCondition.and.returnValue(true);

        spyOn(domutil, 'closest').and.returnValue(true);
    });

    it('_onClick fire custom event "time_click_click" when target element is related with one of event instance of base controllers.', function() {
        var vMouseEvent = {originEvent: 'test'};
        // 클릭 대상 엘리먼트가 id '2'인 일정과 관계가 있을 때
        spyOn(domutil, 'getData').and.returnValue('2');

        // 실행하면
        TimeClick.prototype._onClick.call(mockInst, vMouseEvent);

        // 이벤트가 아래처럼 발생한다
        expect(mockInst.fire).toHaveBeenCalledWith('clickSchedule', {
            schedule: {
                _id: '2',
                text: 'hello'
            },
            event: 'test'
        });
    });

    it('TimeClick doesn\'t fire custom event "time_click_click" when no target or target is not related with schedules.', function() {
        // 엘리먼트가 TimeClick과 관계가 없다
        mockInst.checkExpectCondition.and.returnValue(false);

        // 실행하면
        TimeClick.prototype._onClick.call(mockInst, {});

        // 무반응
        expect(mockInst.fire).not.toHaveBeenCalled();
    });
});
