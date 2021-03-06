/*
© Copyright IBM Corp. 2017
*/

'use strict';

const should = require('should');
const {handler} = require('skill-sdk-nodejs');

describe('Test builtInContext set/get/delete/validate', function () {
    this.timeout(10000);
    let dummyValidContext;
    let dummyInvalidContext;
    let validPath;
    let invalidPath;
    let dummyValue;
    let dummyInvalidValue;
    beforeEach(function (done){
        dummyValidContext = {
            "builtin": {
                "currentConversation": {
                    "@type": "http://www.ibm.com/watson-assistant-solutions/ontology/Conversation",
                    "lastReferencedLocation": {
                        "@type": "http://www.ibm.com/watson-assistant-solutions/ontology/PlaceReference",
                        "object": {
                            "@type": "http://schema.org/Place",
                            "name": "John Hancock Tower Boston",
                            "address": {
                                "@type": "http://schema.org/PostalAddress",
                                "streetAddress": "120 St James Ave",
                                "addressLocality": "Boston",
                                "postalCode": "MA 02116",
                                "addressCountry": "USA"
                            },
                            "geo": {
                                "@type": "http://schema.org/GeoCoordinates",
                                "longitude": "0.1278 W",
                                "latitude": "51.5074 N"
                            }
                        }
                    }
                }
            }
        };

        dummyInvalidContext = { "builtin": {"Dsfds": "Sdfs"}};
        validPath = "currentConversation.lastReferencedLocation";
        invalidPath = "currentConversation.hello.world";
        dummyValue = {
            "@type": "http://www.ibm.com/watson-assistant-solutions/ontology/PlaceReference",
            "object": {
                "@type": "http://schema.org/Place",
                "name": "John Hancock Tower Boston",
                "address": {
                    "@type": "http://schema.org/PostalAddress",
                    "streetAddress": "120 St James Ave",
                    "addressLocality": "Boston",
                    "postalCode": "MA 02116",
                    "addressCountry": "USA"
                },
                "geo": {
                    "@type": "http://schema.org/GeoCoordinates",
                    "longitude": "no",
                    "latitude": "where"
                }
            }
        };
        dummyInvalidValue = {
            "object": {
                "@type": "http://schema.org/Place",
                "name": "John Hancock Tower Boston",
                "address": {
                    "@type": "http://schema.org/PostalAddress",
                    "streetAddress": "120 St James Ave",
                    "addressLocality": "Boston",
                    "postalCode": "MA 02116",
                    "addressCountry": "USA"
                },
                "geo": {
                    "@type": "http://schema.org/GeoCoordinates",
                    "longitude": "no",
                    "latitude": "where"
                }
            }
        };
        done();
    });

    describe('Test set built-in context', function() {
        it('Try setting invalid built-in context property path', function (done) {
            const result = handler.setBuiltinContextProperty(dummyValidContext, invalidPath, dummyValue);
            result.valid.should.equal(false);
            result.status.should.equal(404);
            done()
        });
        it('Try setting valid built-in context property path', function(done) {
            const result = handler.setBuiltinContextProperty(dummyValidContext, validPath, dummyValue);
            result.valid.should.equal(true);
            JSON.stringify(result.obj.currentConversation.lastReferencedLocation).should.equal(JSON.stringify(dummyValue));
            done();
        });
        it('Try setting invalid built-in context property value', function(done) {
            const result = handler.setBuiltinContextProperty(dummyValidContext, validPath, dummyInvalidValue);
            result.valid.should.equal(false);
            JSON.stringify(result.obj).should.equal(JSON.stringify(dummyValidContext.builtin));
            done();
        })
    });

    describe('Test get built-in context', function() {
        it('Try getting built-in context with invalid property path', function(done) {
            const result = handler.getBuiltinContextProperty(dummyValidContext, invalidPath);
            result.valid.should.equal(false);
            result.status.should.equal(400);
            result.should.not.have.property('obj');
            done();
        });
        it('Try getting built-in context with valid property path', function(done) {
            const result = handler.getBuiltinContextProperty(dummyValidContext, validPath);
            result.valid.should.equal(true);
            JSON.stringify(result.value).should.equal(JSON.stringify(dummyValidContext.builtin.currentConversation.lastReferencedLocation));
            done();
        })
    });

    describe('Test delete built in context', function(){
        it('Try deleting built in context with invalid path', function(done) {
            const result = handler.deleteBuiltinContextProperty(dummyValidContext, invalidPath);
            result.valid.should.equal(false);
            result.status.should.equal(404);
            result.should.not.have.property('obj');
            done();
        });
        it('Try deleting built in context with valid path', function(done) {
            const result = handler.deleteBuiltinContextProperty(dummyValidContext, validPath);
            result.valid.should.equal(true);
            result.status.should.equal(200);
            delete dummyValidContext.builtin.currentConversation.lastReferencedLocation;
            result.obj.should.deepEqual(dummyValidContext.builtin);
            done();
        });
    });

    describe('Test validate built in context', function(){
        it('Check validation of invalid built in context', function(done) {
            const result = handler.validateBuiltinContext(dummyInvalidContext);
            result.valid.should.equal(false);
            done();
        });
        it('Check validation of valid built in context', function(done) {
            const result = handler.validateBuiltinContext(dummyValidContext);
            result.valid.should.equal(true);
            done();
        })
    })
});
